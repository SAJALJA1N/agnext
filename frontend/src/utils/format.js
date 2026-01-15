import dayjs from "dayjs";

export const fmtDate = (iso) => (iso ? dayjs(iso).format("MMM D, YYYY") : "—");
