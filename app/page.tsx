import ButtonAuth from "@/components/ButtonAuth";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>
        {" "}
        hello {"{"}&quot;main page&quot;{"}"}{" "}
      </p>
      <ButtonAuth />
    </div>
  );
}
