import got, { Got } from 'got';
import dayjs from 'dayjs';

export class OuraClient {
  OURA_API = 'https://api.ouraring.com/';
  OURA_AUTH = 'https://cloud.ouraring.com/';
  private readonly apiClient: Got;
  constructor(personalAccessToken: string) {
    this.apiClient = got.extend({
      prefixUrl: this.OURA_API,
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
      },
      hooks: {
        beforeRequest: [(r) => console.log(r.url.href)],
      },
    });
  }

  /**
   * @see https://cloud.ouraring.com/docs/personal-info
   */
  async personalInfo() {
    const response = this.apiClient.get('v1/userinfo');
    const data = await response.json<{
      age: string;
      weight: number;
      height: number;
      gender: string;
      email: string;
    }>();
    return data;
  }

  async sleep(params?: {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs
  }) {
    const searchParams = params ? {
      start: params.start.format('YYYY-MM-DD'),
      end: params.end.format('YYYY-MM-DD'),
    } : {}
    const response = this.apiClient.get('v1/sleep', {
      searchParams,
    });
    const data = await response.json<{
      // @see https://cloud.ouraring.com/docs/sleep
      sleep: {
        summary_date: string
        period_id: number
        score: number,
        total: number,
      }[]
    }>();
    return data;
  }
  // TODO: 共通化する
  async activity(params?: {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs
  }) {
    const searchParams = params ? {
      start: params.start.format('YYYY-MM-DD'),
      end: params.end.format('YYYY-MM-DD'),
    } : {}
    const response = this.apiClient.get('v1/activity', {
      searchParams,
    });
    const data = await response.json<{
      // @see https://cloud.ouraring.com/docs/activity
      activity: {
        summary_date: string
        period_id: number
        score: number
      }[]
    }>();
    return data;
  }
  async readiness(params?: {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs
  }) {
    const searchParams = params ? {
      start: params.start.format('YYYY-MM-DD'),
      end: params.end.format('YYYY-MM-DD'),
    } : {}
    const response = this.apiClient.get('v1/readiness', {
      searchParams,
    });
    const data = await response.json<{
      // @see https://cloud.ouraring.com/docs/readiness
      readiness: {
        summary_date: string
        period_id: number
        score: number
      }[]
    }>();
    return data;
  }
  async bedtime(params: {
    start?: string,
    end?: string
  }) {
    const searchParams = {
      start: params?.start,
      end: params?.end,
    }
    const response = this.apiClient.get('v1/bedtime', {
      searchParams,
    });
    const data = await response.json<{
      // @see https://cloud.ouraring.com/docs/bedtime
      readiness: {
        summary_date: string
        period_id: number
        score: number
      }[]
    }>();
    return data;
  }
}
