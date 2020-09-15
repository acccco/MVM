import ReactiveData from "../src/";

interface IDataType {
  foo: string;
  bar: string;
  array: string[];
}

class Test extends ReactiveData<IDataType> {
  data: IDataType = {
    foo: "aco",
    bar: "yang",
    array: ["1", "2"],
  };

  computedHook() {
    this.addComputed(
      "fullname",
      (data) => `${data.foo} ${data.bar}`,
      (data, fullname: string) => {
        let names = fullname.split(" ");
        data.foo = names[0];
        data.bar = names[1];
      },
    );
  }

  watchHook() {
    this.addWatch("foo", (newValue, oldValue) => {
      console.log(newValue, oldValue);
    });
    this.addWatch("array", (newValue, oldValue) => {
      console.log(newValue, oldValue);
    });
  }
}

// @ts-ignore
window.aaaa = new Test();
