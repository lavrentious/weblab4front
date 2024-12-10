import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Hit } from "./hit.model";

export const hitsApi = createApi({
  reducerPath: "hitsApi",
  tagTypes: ["Hits"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + "/hits",
  }),
  endpoints: (builder) => ({
    getAllHits: builder.query<Hit[], void>({
      query: () => ``,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Hits", id }) as const),
              { type: "Hits", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Hits', id: 'LIST' }` is invalidated
            [{ type: "Hits", id: "LIST" }],
    }),
    createHit: builder.mutation<Hit, { x: number; y: number; r: number }>({
      query: ({ x, y, r }) => ({
        url: ``,
        method: "POST",
        body: { x, y, r },
      }),
      invalidatesTags: [{ type: "Hits", id: "LIST" }],
    }),
  }),
});

export const { useGetAllHitsQuery, useCreateHitMutation } = hitsApi;
