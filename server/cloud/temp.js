// const AWS = require('aws-sdk');
// const ec2 = new AWS.EC2();
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());

// // Function to create a new EC2 instance
// const createInstance = async () => {
//   const params = {
//     ImageId: 'ami-xxxxxxxx', // replace with your preferred image ID
//     InstanceType: 't2.micro',
//     KeyName: 'my-key-pair',
//     MaxCount: 1,
//     MinCount: 1,
//     SecurityGroupIds: ['sg-xxxxxxxx'], // replace with your security group ID
//     UserData: Buffer.from('YOUR_USER_DATA').toString('base64'), // replace with your user data script
//   };

//   try {
//     const result = await ec2.runInstances(params).promise();
//     const instanceId = result.Instances[0].InstanceId;
//     console.log(`Created instance ${instanceId}`);
//     return instanceId;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// // Function to terminate an EC2 instance
// const terminateInstance = async (instanceId) => {
//   const params = {
//     InstanceIds: [instanceId],
//   };

//   try {
//     await ec2.terminateInstances(params).promise();
//     console.log(`Terminated instance ${instanceId}`);
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Function to check if an EC2 instance is running
// const isInstanceRunning = async (instanceId) => {
//   const params = {
//     InstanceIds: [instanceId],
//   };

//   try {
//     const result = await ec2.describeInstances(params).promise();
//     return result.Reservations[0].Instances[0].State.Name === 'running';
//   } catch (err) {
//     console.error(err);
//     return false;
//   }
// };

// // Function to create a new instance or return a free instance
// const getInstance = async () => {
//   // Check for a free instance
//   const freeInstances = await getFreeInstances();

//   if (freeInstances.length > 0) {
//     // Return the first free instance
//     return freeInstances[0];
//   }

//   // No free instances, create a new one
//   const instanceId = await createInstance();
//   return instanceId;
// };

// // Function to get a list of free instances
// const getFreeInstances = async () => {
//   const instances = await getAllInstances();
//   const freeInstances = instances.filter((instance) => instance.Tags.some((tag) => tag.Key === 'status' && tag.Value === 'free'));
//   return freeInstances;
// };

// // Function to get a list of all instances
// const getAllInstances = async () => {
//   const params = {
//     Filters: [{ Name: 'instance-state-name', Values: ['running'] }],
//   };

//   try {
//     const result = await ec2.describeInstances(params).promise();
//     const instances = result.Reservations.flatMap((reservation) => reservation.Instances);
//     return instances;
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };

// // Function to set an instance as free
// const setInstanceFree = async (instanceId) => {
//   const params = {
//     Resources: [instanceId],
//     Tags: [{ Key: 'status', Value: 'free' }],
//   };

//   try {
//     await ec2.createTags(params).promise();
//     console.log(`Set instance ${instanceId} as free`);
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Function to assign an instance to a user
// const assignInstanceToUser = async (instanceId, userId) => {
//     const params = {
//       Resources: [instanceId],
//       Tags: [{ Key: 'status', Value: 'assigned' }, { Key: 'user', Value: userId }],
//     };

//     try {
//       await ec2.createTags(params).promise();
//       console.log(`Assigned instance ${instanceId} to user ${userId}`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Function to get the user assigned to an instance
//   const getUserForInstance = async (instanceId) => {
//     const params = {
//       Filters: [{ Name: 'resource-id', Values: [instanceId] }, { Name: 'key', Values: ['user'] }],
//     };

//     try {
//       const result = await ec2.describeTags(params).promise();
//       const userTag = result.Tags.find((tag) => tag.Key === 'user');
//       return userTag ? userTag.Value : null;
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   };

//   // Endpoint to assign an instance to a user
//   app.post('/instances/:instanceId/assign', async (req, res) => {
//     const instanceId = req.params.instanceId;
//     const userId = req.body.userId;

//     if (!userId) {
//       res.status(400).send({ error: 'userId is required' });
//       return;
//     }

//     const isRunning = await isInstanceRunning(instanceId);
//     if (!isRunning) {
//       res.status(400).send({ error: `Instance ${instanceId} is not running` });
//       return;
//     }

//     const user = await getUserForInstance(instanceId);
//     if (user) {
//       res.status(400).send({ error: `Instance ${instanceId} is already assigned to user ${user}` });
//       return;
//     }

//     await assignInstanceToUser(instanceId, userId);
//     await setInstanceAssigned(instanceId);

//     res.send({ success: true });
//   });

//   // Function to set an instance as assigned
//   const setInstanceAssigned = async (instanceId) => {
//     const params = {
//       Resources: [instanceId],
//       Tags: [{ Key: 'status', Value: 'assigned' }],
//     };

//     try {
//       await ec2.createTags(params).promise();
//       console.log(`Set instance ${instanceId} as assigned`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Endpoint to free an instance
//   app.post('/instances/:instanceId/free', async (req, res) => {
//     const instanceId = req.params.instanceId;

//     const isRunning = await isInstanceRunning(instanceId);
//     if (!isRunning) {
//       res.status(400).send({ error: `Instance ${instanceId} is not running` });
//       return;
//     }

//     const user = await getUserForInstance(instanceId);
//     if (!user) {
//       res.status(400).send({ error: `Instance ${instanceId} is not assigned to any user` });
//       return;
//     }

//     await setInstanceFree(instanceId);

//     res.send({ success: true });
//   });

//   // Start the server
//   app.listen(3000, () => {
//     console.log('Server listening on port 3000');
//   });

const AWS = require("aws-sdk");
const EC2 = new AWS.EC2();
const SSM = new AWS.SSM();

const runningInstances = [];

const launchInstance = (userData) => {
  const params = {
    ImageId: "ami-0677e34e038a1c3fe",
    InstanceType: "t2.small",
    KeyName: "testaing",
    MinCount: 1,
    MaxCount: 1,
    UserData: userData,
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [
          {
            Key: "Name",
            Value: "Something",
          },
        ],
      },
    ],
  };

  EC2.runInstances(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const instanceId = data.Instances[0].InstanceId;
    console.log(`Created instance ${instanceId}`);

    runningInstances.push({
      instanceId: instanceId,
      status: "occupied",
      lastUsed: new Date(),
    });
  });
};

const createApiOnInstance = (publicIpAddress, callback) => {
  // Code to create an API on the instance and run a process
  // You can use the publicIpAddress to establish the connection to the instance
  // Once the process is completed, send a POST request to your backend
  // Example:
  // const axios = require('axios');
  // axios.post('https://yourbackend.com/api/process', { data: 'yourdata' })
  //   .then(response => {
  //     console.log(response.data);
  //     callback();
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     callback(error);
  //   });
};

const assignInstanceToUser = (callback) => {
  let freeInstance = runningInstances.find(
    (instance) => instance.status === "free"
  );
  if (freeInstance) {
    freeInstance.status = "occupied";
    freeInstance.lastUsed = new Date();
    callback(null, freeInstance.instanceId);
  } else {
    const userData = `#!/bin/bash\n${createApiOnInstance.toString()}\ncreateApiOnInstance(${callback.toString()});\n`;
    launchInstance(userData);
  }
};

const markFreeInstance = (instanceId) => {
  let instance = runningInstances.find(
    (instance) => instance.instanceId === instanceId
  );
  if (instance) {
    instance.status = "free";
    instance.lastUsed = new Date();
    console.log(`Instance ${instanceId} marked as free`);
  }
};

const terminateInstance = () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  runningInstances.forEach((instance) => {
    if (instance.status === "free" && instance.lastUsed < thirtyMinutesAgo) {
      console.log(`Stopping instance ${instance.instanceId}`);
      EC2.terminateInstances(
        { InstanceIds: [instance.instanceId] },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            instance.status = "stopped";
            console.log(`Instance ${instance.instanceId} stopped`);
          }
        }
      );
    }
  });
};

setInterval(terminateInstance, 5 * 60 * 1000);

// Example usage
assignInstanceToUser((err, instanceId) => {
  if (err) {
    console.error(err);
    console.log("Error assigning instance");
  } else if (instanceId) {
    const describeParams = {
      InstanceIds: [instanceId],
    };
    EC2.describeInstances(describeParams, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const publicIpAddress = data.Reservations[0].Instances[0].PublicIpAddress;
      console.log(`Instance ${instanceId} assigned to user`);
      createApiOnInstance(publicIpAddress, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`API created on instance ${instanceId}`);
          markFreeInstance(instanceId);
        }
      });
    });
  } else {
    console.log("No free instances available, launching a new instance");
  }
});
