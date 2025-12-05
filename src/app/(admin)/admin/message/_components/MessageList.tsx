import MessageRow from "./MessageRow";

export default function MessageList({
  messages,
  onOpen,
}: {
  messages: any[];
  onOpen: (id: string) => void;
}) {
  if (!messages.length) {
    return <p className="text-white/50">Aucun message trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Sujet</th>
            <th className="p-3">Message</th>
            <th className="p-3">Date</th>

            {/* ici changement demandé */}
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} onOpen={onOpen} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
