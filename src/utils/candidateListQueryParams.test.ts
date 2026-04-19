import { describe, expect, it } from '@jest/globals';
import {
  parseCandidateListQueryParams,
  reduceCandidateListQueryParams,
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

  it('resets page and default order when sort changes through the reducer', () => {
    const nextParams = reduceCandidateListQueryParams(
      {
        verdict: 'ЧАСТИЧНО',
        search: 'Ivan',
        sort: 'name',
        order: 'asc',
        page: 4,
      },
      { type: 'setSort', sort: 'createdAt' },
    );

    expect(nextParams).toEqual({
      verdict: 'ЧАСТИЧНО',
      search: 'Ivan',
      sort: 'createdAt',
      order: 'desc',
      page: 1,
    });
  });

  it('keeps current params unchanged when toggling order without an active sort', () => {
    const currentParams = {
      verdict: undefined,
      search: undefined,
      sort: undefined,
      order: undefined,
      page: 1,
    } as const;

    expect(
      reduceCandidateListQueryParams(currentParams, { type: 'toggleOrder' }),
    ).toEqual(currentParams);
  });

  it('resets all filter params back to the default state', () => {
    const nextParams = reduceCandidateListQueryParams(
      {
        verdict: 'ПОДХОДИТ',
        search: 'Anna',
        sort: 'status',
        order: 'asc',
        page: 3,
      },
      { type: 'reset' },
    );

    expect(nextParams).toEqual({ page: 1 });
  });
});
