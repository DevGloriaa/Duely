export default function Alert({ children, tone = "error" }) {
  if (!children) return null;
  return (
    <p className={`alert alert-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
