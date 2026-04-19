import { Blob, File } from 'node:buffer';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';

type HeaderInitValue =
  | Record<string, string>
  | Array<[string, string]>
  | SimpleHeaders;

class SimpleHeaders {
  private readonly headers = new Map<string, string>();

  constructor(init?: HeaderInitValue) {
    if (!init) {
      return;
    }

    if (init instanceof SimpleHeaders) {
      init.forEach((value, key) => {
        this.headers.set(key.toLowerCase(), value);
      });

      return;
    }

    if (Array.isArray(init)) {
      init.forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });

      return;
    }

    Object.entries(init).forEach(([key, value]) => {
      this.headers.set(key.toLowerCase(), value);
    });
  }

  append(key: string, value: string) {
    this.headers.set(key.toLowerCase(), value);
  }

  get(key: string) {
    return this.headers.get(key.toLowerCase()) ?? null;
  }

  set(key: string, value: string) {
    this.headers.set(key.toLowerCase(), value);
  }

  forEach(
    callback: (value: string, key: string, parent: SimpleHeaders) => void,
  ) {
    this.headers.forEach((value, key) => {
      callback(value, key, this);
    });
  }
}

class SimpleRequest {
  readonly body: BodyInit | null;
  readonly headers: SimpleHeaders;
  readonly method: string;
  readonly signal: AbortSignal | null;
  readonly url: string;

  constructor(
    input: string | URL | SimpleRequest,
    init?: {
      body?: BodyInit | null;
      headers?: HeaderInitValue;
      method?: string;
      signal?: AbortSignal | null;
    },
  ) {
    this.url = input instanceof SimpleRequest ? input.url : input.toString();
    this.method = init?.method ?? 'GET';
    this.headers = new SimpleHeaders(init?.headers);
    this.signal = init?.signal ?? null;
    this.body = init?.body ?? null;
  }
}

class SimpleResponse {
  readonly body: BodyInit | null;
  readonly headers: SimpleHeaders;
  readonly status: number;
  readonly statusText: string;

  constructor(
    body: BodyInit | null = null,
    init?: {
      headers?: HeaderInitValue;
      status?: number;
      statusText?: string;
    },
  ) {
    this.body = body;
    this.headers = new SimpleHeaders(init?.headers);
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? '';
  }
}

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream as typeof global.ReadableStream;
}

if (!global.TransformStream) {
  global.TransformStream = TransformStream as typeof global.TransformStream;
}

if (!global.WritableStream) {
  global.WritableStream = WritableStream as typeof global.WritableStream;
}

if (!global.Blob) {
  global.Blob = Blob as typeof global.Blob;
}

if (!global.File) {
  global.File = File as typeof global.File;
}

if (!global.Headers) {
  global.Headers = SimpleHeaders as unknown as typeof global.Headers;
}

if (!global.Request) {
  global.Request = SimpleRequest as unknown as typeof global.Request;
}

if (!global.Response) {
  global.Response = SimpleResponse as unknown as typeof global.Response;
}
