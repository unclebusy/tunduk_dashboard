import { describe, expect, it } from 'vitest';
import {
  parseCandidateListQueryParams,
  serializeCandidateListQueryParams,
} from './candidateListQueryParams';

describe('candidateListQueryParams', () => {
  it('parses supported query params into typed values', () => {
    const parsedParams = parseCandidateListQueryParams(
      'verdict=%D0%9F%D0%9E%D0%94%D0%A5%D0%9E%D0%94%D0%98%D0%A2&search=%20Anna%20&sort=name&order=desc&page=3',
    );

    expect(parsedParams).toEqual({
      verdict: 'ПОДХОДИТ',
      search: 'Anna',
      sort: 'name',
      order: 'desc',
      page: 3,
    });
  });

  it('falls back to safe defaults for invalid values', () => {
    const parsedParams = parseCandidateListQueryParams(
      'verdict=UNKNOWN&sort=invalid&page=0&search=%20%20',
    );

    expect(parsedParams).toEqual({
      verdict: undefined,
      search: undefined,
      sort: undefined,
      order: undefined,
      page: 1,
    });
  });

  it('serializes only meaningful query params', () => {
    const searchParams = serializeCandidateListQueryParams({
      verdict: 'ЧАСТИЧНО',
      search: '  Ivan  ',
      sort: 'status',
      order: 'asc',
      page: 1,
    });

    expect(searchParams.toString()).toBe(
      'verdict=%D0%A7%D0%90%D0%A1%D0%A2%D0%98%D0%A7%D0%9D%D0%9E&search=Ivan&sort=status&order=asc',
    );
  });

  it('keeps page when it is greater than one', () => {
    const searchParams = serializeCandidateListQueryParams({
      page: 2,
    });

    expect(searchParams.toString()).toBe('page=2');
  });

  it('supports total experience as a sort field', () => {
    const parsedParams = parseCandidateListQueryParams('sort=totalExp');

    expect(parsedParams.sort).toBe('totalExp');
    expect(parsedParams.order).toBe('desc');
  });
});
