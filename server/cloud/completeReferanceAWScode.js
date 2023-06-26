const AWS = require("aws-sdk");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const s3 = new AWS.S3();
const ec2 = new AWS.EC2();
const autoscaling = new AWS.AutoScaling();

const instanceLimit = 10; // Maximum number of spot instances to launch

let waitingList = []; // Queue of user requests waiting for available instances

// Function to launch a new spot instance and run the user request on it
async function launchInstanceAndRunJob(requestData) {
  try {
    // Launch a new spot instance with the required user data script
    const userDataScript = `#!/bin/bash
      # Download required packages and user files from S3
      aws s3 cp s3://<your-s3-bucket>/<user-files-path> /home/ec2-user/
      aws s3 cp s3://<your-s3-bucket>/<user-models-path> /home/ec2-user/
      # Run Python app with user data
      python3 /home/ec2-user/<your-python-app> <user-data>
      # Upload output to S3 and terminate instance
      aws s3 cp <output-file> s3://<your-s3-bucket>/<output-path>
      aws ec2 terminate-instances --instance-ids $(curl -s http://169.254.169.254/latest/meta-data/instance-id)`;
    const launchResponse = await ec2
      .requestSpotInstances({
        SpotPrice: "<your-spot-price>",
        InstanceCount: 1,
        LaunchSpecification: {
          ImageId: "<your-ami-id>",
          InstanceType: "<your-instance-type>",
          KeyName: "<your-key-name>",
          SecurityGroupIds: ["<your-security-group-id>"],
          SubnetId: "<your-subnet-id>",
          UserData: new Buffer(userDataScript).toString("base64"),
        },
      })
      .promise();
    const instanceId = launchResponse.SpotInstanceRequests[0].InstanceId;
    console.log(`Launched new instance with ID ${instanceId}`);

    // Wait for the new instance to become running
    await ec2
      .waitFor("instanceRunning", { InstanceIds: [instanceId] })
      .promise();
    console.log(`Instance ${instanceId} is running`);

    // Wait for the instance to finish running the user request
    await ec2
      .waitFor("instanceStopped", { InstanceIds: [instanceId] })
      .promise();
    console.log(`Instance ${instanceId} has stopped`);

    // Upload the output file to S3
    await s3
      .upload({
        Bucket: "<your-s3-bucket>",
        Key: `<output-path>/<output-file>`,
        Body: fs.createReadStream(`<path-to-output-file>`),
      })
      .promise();

    // Terminate the instance
    await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();
    console.log(`Instance ${instanceId} has been terminated`);
  } catch (err) {
    console.error(`Error launching instance and running job: ${err}`);
  }
}

// Function to check for available instances and launch any waiting user requests
async function checkWaitingList() {
  try {
    // Get the current number of running spot instances in the auto-scaling group
    const runningInstancesResponse = await autoscaling
      .describeAutoScalingGroups({
        AutoScalingGroupNames: ["<your-auto-scaling-group-name>"],
      })
      .promise();
    const runningInstancesCount =
      runningInstancesResponse.AutoScalingGroups[0].Instances.filter(
        (instance) =>
          instance.LifecycleState === "InService" &&
          instance.HealthStatus === "Healthy"
      ).length;
    console.log(`Currently running ${runningInstancesCount} instances`);

    // Check if there are any user requests waiting and available instances to launch
    while (waitingList.length > 0 && runningInstancesCount < instanceLimit) {
      const requestData = waitingList.shift();
      console.log(`Launching instance for user ${requestData.userId}`);

      // Launch a new spot instance and run the user request on it
      await launchInstanceAndRunJob(requestData);

      // Update the running instance count
      const updatedRunningInstancesResponse = await autoscaling
        .describeAutoScalingGroups({
          AutoScalingGroupNames: ["<your-auto-scaling-group-name>"],
        })
        .promise();
      runningInstancesCount =
        updatedRunningInstancesResponse.AutoScalingGroups[0].Instances.filter(
          (instance) =>
            instance.LifecycleState === "InService" &&
            instance.HealthStatus === "Healthy"
        ).length;
      console.log(`Currently running ${runningInstancesCount} instances`);
    }
  } catch (err) {
    console.error(
      `Error checking waiting list and launching instances: ${err}`
    );
  }
}

// API endpoint to handle user requests
app.post("/processUserRequest", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userData = req.body.userData;

    // Upload user files and models to S3
    await s3
      .upload({
        Bucket: "<your-s3-bucket>",
        Key: `<user-files-path>/<user-files>.zip`,
        Body: fs.createReadStream(`<path-to-user-files>.zip`),
      })
      .promise();
    await s3
      .upload({
        Bucket: "<your-s3-bucket>",
        Key: `<user-models-path>/<user-models>.zip`,
        Body: fs.createReadStream(`<path-to-user-models>.zip`),
      })
      .promise();

    // Add user request to waiting list
    waitingList.push({ userId, userData });

    // Check for available instances to launch user request
    await checkWaitingList();

    res.status(200).send("User request received");
  } catch (err) {
    console.error(`Error processing user request: ${err}`);
    res.status(500).send("Error processing user request");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
