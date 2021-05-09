import { OuraClient } from './oura';
import { WebClient } from '@slack/web-api';
import dayjs from 'dayjs';

const ouraClient = new OuraClient('REPLACE_ME')
const slackClient = new WebClient('REPLACE_ME');

const main = async () => {
  const sleep = await ouraClient.sleep({
    start: dayjs().subtract(1, 'd'),
    end: dayjs(),
  });
  const readiness = await ouraClient.readiness({
    start: dayjs().subtract(1, 'd'),
    end: dayjs(),
  });
  const sleepStatus = sleep.sleep[0];
  const readinessScore = readiness.readiness[0].score;
  await slackClient.users.profile.set({
    profile: `{
      "status_emoji": ":ring:",
      "status_text": "Sleep Score: ${sleepStatus.score}, Sleep Total: ${(sleepStatus.total / 3600).toFixed(2)}h, Readiness Score: ${readinessScore}"
    }`
  });
}

main();
