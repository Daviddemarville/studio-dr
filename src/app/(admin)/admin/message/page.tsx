import { getMessages } from "./_components/message-actions";
import ClientWrapper from "./_components/ClientWrapper";

export default async function Page() {
  const messages = await getMessages("all");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Messages reçus</h1>

      <ClientWrapper initialMessages={messages} />
    </div>
  );
}
