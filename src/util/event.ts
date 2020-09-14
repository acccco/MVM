import ReactiveData from "..";

export default function initEvent(rd: ReactiveData) {
  if (rd.$option.event) {
    let event = rd.$option.event;
    Object.keys(event).forEach((key) => {
      rd.on(key, event[key]);
    });
  }
}
