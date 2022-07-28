import { useEffect, useState } from "react";
import { getLocalDateString } from "../shared/dateHelpers";

interface Props {
  date: string;
}

export function DisplayDate(props: Props) {
  const [displayDate, setDisplayDate] = useState(props.date);

  useEffect(() => {
    setDisplayDate(getLocalDateString(new Date(props.date)));
  }, [props.date]);

  return <> {displayDate}</>;
}
