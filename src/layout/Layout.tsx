import type { ReactNode, VFC } from "react";
import { Header } from "src/layout/Header";

type Props = {
  children: ReactNode;
};

export const Layout: VFC<Props> = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { children } = props;
  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto w-full px-4">{children}</main>
    </div>
  );
};
