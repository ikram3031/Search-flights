import { Suspense } from "react";
import SearchFlights from "./searchFlights";

type Props = {};

const page = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchFlights />
    </Suspense>
  );
};

export default page;
