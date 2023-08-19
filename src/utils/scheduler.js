const { SchedulerClient, CreateScheduleCommand, DeleteScheduleCommand } = require('@aws-sdk/client-scheduler');

const region = process.env.REGION;
const config = {
  region,
};

const client = new SchedulerClient(config);

const getScheduleExpression = (currentDate) => {
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 30);
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');
  const hours = String(futureDate.getHours()).padStart(2, '0');
  const minutes = String(futureDate.getMinutes()).padStart(2, '0');
  const seconds = String(futureDate.getSeconds()).padStart(2, '0');

  return `at(${year}-${month}-${day}T${hours}:${minutes}:${seconds})`;
};

const createSchedule = async (cognito_sub) => {
  const input = {
    Name: `${cognito_sub}_deactivate_request`,
    GroupName: 'default',
    ScheduleExpression: getScheduleExpression(new Date()),
    Description: `Deletes ${cognito_sub}'s account`,
    Target: {
      Arn: process.env.TARGET_FUNCTION_ARN,
      RoleArn: process.env.IAM_ROLE_ARN,
      RetryPolicy: {
        MaximumEventAgeInSeconds: Number('60'),
        MaximumRetryAttempts: Number('3'),
      },
      Input: JSON.stringify({}),
    },
    FlexibleTimeWindow: {
      Mode: 'OFF',
    },
  };

  const command = new CreateScheduleCommand(input);

  const response = await client
    .send(command)
    .then((responseData) => {
      const scheduled = responseData.ScheduleArn;

      if (scheduled) {
        return {
          success: true,
          errors: '',
        };
      }
      return {
        success: false,
        errors: JSON.stringify(responseData.$metadata),
      };
    })
    .catch((err) => {
      return {
        success: false,
        errors: err,
      };
    });

  return response;
};

const deleteSchedule = async (cognito_sub) => {
  const input = {
    Name: `${cognito_sub}_deactivate_request`,
  };

  const command = new DeleteScheduleCommand(input);

  const response = await client
    .send(command)
    .then((responseData) => {
      const statusCode = responseData.$metadata.httpStatusCode;

      if (statusCode == 200) {
        return {
          success: true,
          errors: '',
        };
      }
      return {
        success: false,
        errors: JSON.stringify(responseData.$metadata),
      };
    })
    .catch((err) => {
      return {
        success: false,
        errors: err,
      };
    });

  return response;
};

module.exports = {
  createSchedule,
  deleteSchedule,
};
