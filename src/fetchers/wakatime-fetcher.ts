export interface WakaTimeData {
  categories: {
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  daily_average: number;
  daily_average_including_other_language: number;
  days_including_holidays: number;
  days_minus_holidays: number;
  editors: {
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  holidays: number;
  human_readable_daily_average: string;
  human_readable_daily_average_including_other_language: string;
  human_readable_total: string;
  human_readable_total_including_other_language: string;
  id: string;
  is_already_updating: boolean;
  is_coding_activity_visible: boolean;
  is_including_today: boolean;
  is_other_usage_visible: boolean;
  is_stuck: boolean;
  is_up_to_date: boolean;
  languages: {
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  operating_systems: {
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  percent_calculated: number;
  range: string;
  status: string;
  timeout: number;
  total_seconds: number;
  total_seconds_including_other_language: number;
  user_id: string;
  username: string;
  writes_only: boolean;
}

interface WakaTimeFetcherOptions {
  username: string;
  apiDomain?: string;
  range?: "" | "last_7_days" | "last_30_days" | "last_6_months" | "last_year";
}

export async function fetchWakatimeStats({
  username,
  apiDomain = "wakatime.com",
  range = "",
}: WakaTimeFetcherOptions): Promise<WakaTimeData> {
  const response = range === ""
    ? await fetch(
      `https://${apiDomain}/api/v1/users/${username}/stats?is_including_today=true`,
    )
    : await fetch(
      `https://${apiDomain}/api/v1/users/${username}/stats/${range}?is_including_today=true`,
    );

  const data = await response.json();
  return data.data;
}
