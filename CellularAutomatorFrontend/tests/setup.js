import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

import { API_URL } from '../src/api';

export const restHandlers = [
  http.post(`${API_URL}/auth/signin`, (request) => {
    const token = "tokenString";
    const res = {token: token};
    return HttpResponse.json(res);
  }),
]

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

afterEach(() => {
  server.resetHandlers();
  cleanup();
});