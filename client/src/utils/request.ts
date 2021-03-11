import { SERVER_LINKS } from 'src/app/constants/links.constant';

export class ResponseError extends Error {
  public response: Response;
  public status: number;
  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
    this.status = response.status;
  }
}

function parseJSON(res: Response) {
  if (res.status === 204 || res.status === 205) {
    return null;
  }
  return res.json();
}

function checkStatus(res: Response) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  const error = new ResponseError(res);
  error.response = res;
  throw error;
}

export async function request(url: string, options?: RequestInit) {
  const moreOptions: RequestInit = {
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const fetchResponse = await fetch(url, moreOptions);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}
export async function requestWithAuth(url: string, options?: RequestInit) {
  const moreOptions: RequestInit = {
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  await fetch(SERVER_LINKS.authAutoRefresh, { method: 'POST', ...moreOptions });

  const fetchResponse = await fetch(url, moreOptions);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}
