import logoImg from "../assets/logo.jpg";

export default function Header() {
  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="" />
        <h2>Food App</h2>
      </div>
      <nav>
        <button>Cart (0)</button>
      </nav>
    </header>
  );
}
