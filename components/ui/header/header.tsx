import HeaderLeft from "./left";
import HeaderRight from "./right";

export default function Header() {
  return (
    <div className="mx-4 flex items-center justify-between py-4">
      <HeaderLeft />
      <HeaderRight />
    </div>
  );
}
