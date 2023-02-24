import { jest } from "@jest/globals";

// Mock ResizeObserve for OpenLayers
// Mock the core functions as per https://stackoverflow.com/a/70704588
//  rather than using the full polyfill (which is uneccessary for tests)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as any;
