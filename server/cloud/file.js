const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: "AKIAWCIX6VGLGMVO4XQ7",
  secretAccessKey: "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",
});

let instanceCount = 5;
let runningInstanceList = [];
let freeInstanceList = [];
const ec2 = new AWS.EC2({ region: "ap-south-1" });

const createInstance = () => {
  const ec2 = new AWS.EC2({ region: "ap-south-1" });
  const params = {
    ImageId: "ami-0677e34e038a1c3fe",
    InstanceType: "t2.small",
    KeyName: "testaing",
    MinCount: 1,
    MaxCount: 1,
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

  ec2.runInstances(params, (err, data) => {
    if (data) {
      console.log(data);
      instanceCount = -1;
      // checkInstanceRun()
    }
    if (err) {
      console.log(err);
    }
  });
};
// createInstance();
console.log(instanceCount);
const checkInstanceRun = () => {
  ec2.describeInstances({ InstanceIds: [instanceId] }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const state = data.Reservations[0].Instances[0].State.Name;
      if (state !== "running") {
        console.log("Instance is not running. Current state:", state);
        return;
      }
      if (state === "running") {
        console.log("oh man im running");
      }

      // If the instance is running, send the command
      const commands = ["python -c \"print('Hello, World!')\""];
      const params = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      ssm.sendCommand(params, (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
      });
    }
  });
};

const ssm = new AWS.SSM({ region: "ap-south-1" });
const instanceIds = ["i-00f23c4b1356a6ccc"];

const sendCommands = () => {
  const commands = ["python3 -c \"print('Hello, World!')\""];
  const params = {
    InstanceIds: instanceIds,
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: commands,
    },
  };

  ssm.sendCommand(params, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  });
};
sendCommands();
// Check the current state of the instance

const checkCmdState = () => {
  const commandId = "0c75df17-a983-49b1-bf00-a327e7d85961";

  const params = {
    CommandId: commandId,
    InstanceId: instanceId,
  };

  ssm.getCommandInvocation(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data.Status);
      console.log(data.StandardOutputContent);
      console.log(data.StandardErrorContent);
    }
  });
};

const terminateInstances = () => {
  let params = {
    InstanceIds: ["i-058843f93802ddf6e"],
  };
  ec2.terminateInstances(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
};

const createInstancegetIP = () => {
  const params = {
    ImageId: "ami-0677e34e038a1c3fe",
    InstanceType: "t2.small",
    KeyName: "testaing",
    MinCount: 1,
    MaxCount: 1,
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

  ec2.runInstances(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const instanceId = data.Instances[0].InstanceId;
    console.log(`Created instance ${instanceId}`);

    const params = {
      InstanceIds: [instanceId],
      Filters: [
        {
          Name: "instance-state-name",
          Values: ["running"],
        },
        {
          Name: "network-interface.association.public-ip",
          Values: ["*"],
        },
      ],
    };

    ec2.waitFor("instanceRunning", params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const publicIpAddress = data.Reservations[0].Instances[0].PublicIpAddress;
      console.log(
        `Instance ${instanceId} is running and has public IP address ${publicIpAddress}`
      );
      //sending commands and check
      const commands = ["python3 -c \"print('Hello, World!')\""];
      const params = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      ssm.sendCommand(params, (err, data) => {
        if (err) {
          console.log(err);
        }
        //checking is execurted  or not
        console.log(data);
        const commandId = data.Command;
        const params = {
          CommandId: commandId,
          InstanceId: instanceId,
        };

        ssm.getCommandInvocation(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data.Status);
            console.log(data.StandardOutputContent);
            console.log(data.StandardErrorContent);
          }
        });
      });
    });
  });
};
// createInstancegetIP()

Parse.Cloud.define("UpdateResults", (req) => {
  const user = req.user;
  user.set("results", url);
  user.save();
});

let runningInstances = [];

const launchInstance = () => {
  // runningInstances.push({
  //   instanceId: instanceId,
  //   status: "free",
  //   lastUsed: new Date(),
  // });
  // assignInstanceToUser();

  const params = {
    ImageId: "ami-0677e34e038a1c3fe",
    InstanceType: "t2.small",
    KeyName: "testaing",
    MinCount: 1,
    MaxCount: 1,
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

  ec2.runInstances(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const instanceId = data.Instances[0].InstanceId;
    console.log(`Created instance ${instanceId}`);

    const params = {
      InstanceIds: [instanceId],
      Filters: [
        {
          Name: "instance-state-name",
          Values: ["running"],
        },
        {
          Name: "network-interface.association.public-ip",
          Values: ["*"],
        },
      ],
    };

    ec2.waitFor("instanceRunning", params, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const publicIpAddress = data.Reservations[0].Instances[0].PublicIpAddress;
      console.log(
        `Instance ${instanceId} is running and has public IP address ${publicIpAddress}`
      );
      //sending commands and check
      const commands = ["python3 -c \"print('Hello, World!')\""];
      const params = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      ssm.sendCommand(params, (err, data) => {
        if (err) {
          console.log(err);
        }
        //checking is execurted  or not
        console.log(data);
        const commandId = data.Command;
        const params = {
          CommandId: commandId,
          InstanceId: instanceId,
        };

        ssm.getCommandInvocation(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            runningInstances.push({
              instanceId: instanceId,
              status: "free",
              lastUsed: new Date(),
            });
            console.log(data.Status);
            console.log(data.StandardOutputContent);
            console.log(data.StandardErrorContent);
            assignInstanceToUser();
          }
        });
      });
    });
  });
};

function assignInstanceToUser() {
  let freeInstance = runningInstances.find(
    (instance) => instance.status === "free"
  );
  if (freeInstance) {
    freeInstance.status = "occupied";
    freeInstance.lastUsed = new Date();
    return freeInstance.instanceId;
  } else {
    launchInstance();
    return null;
  }
}

function terminateInstance() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  runningInstances.forEach((instance) => {
    if (instance.status === "free" && instance.lastUsed < thirtyMinutesAgo) {
      console.log(`Stopping instance ${instance.instanceId}`);
      ec2.terminateInstances(
        { InstanceIds: [instance.instanceId] },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            instance.status = "stopped";
          }
        }
      );
    }
  });
}

function markFreeInstance(instanceId) {
  let instance = runningInstances.find(
    (instance) => instance.instanceId === instanceId
  );
  if (instance) {
    instance.status = "free";
    instance.lastUsed = new Date();
    console.log(`Instance ${instanceId} marked as free`);
  }
}
setInterval(terminateInstance, 5 * 60 * 1000); // check every 5 minutes

// Example usage
const instanceId = assignInstanceToUser();
if (instanceId) {
  markFreeInstance(instanceId);
  console.log("instance assigned sucessfully");
} else {
  console.log("no free instances available, try again later");
}
