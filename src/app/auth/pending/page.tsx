"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function PendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id") ?? "";
  const email = searchParams?.get("email") ?? "";
  const source = searchParams?.get("source");

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const sendValidationEmail = useCallback(async () => {
    setStatus("sending");
    setMessage(null);

    try {
      const supabase = createClient();

      // Get the current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userEmail = user?.email || email;
      const userId = user?.id || id;

      if (!userEmail) {
        setStatus("error");
        setMessage("Adresse email introuvable.");
        return;
      }

      // Call the resend API route
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          email: userEmail,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Erreur lors de l'envoi de l'email");
      }

      setStatus("ok");
      setMessage(
        "Email de confirmation envoyé avec succès. Vérifiez votre boîte de réception.",
      );
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite",
      );
    }
  }, [email, id]);

  const sentRef = useRef(false);

  // Check approval status and set up real-time subscription
  useEffect(() => {
    const supabase = createClient();

    const checkApprovalStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Check current approval status
      const { data: profile } = await supabase
        .from("users")
        .select("is_approved")
        .eq("id", user.id)
        .maybeSingle();

      // If already approved, redirect to admin
      if (profile?.is_approved) {
        router.push("/admin");
        return;
      }

      // Set up real-time subscription to listen for approval changes
      const channel = supabase
        .channel(`profile-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            // Check if is_approved changed to true
            if (payload.new && payload.new.is_approved === true) {
              router.push("/admin");
            }
          },
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkApprovalStatus();
  }, [router]);

  useEffect(() => {
    if (!sentRef.current && source === "signup") {
      sentRef.current = true;
      sendValidationEmail();
    }
  }, [sendValidationEmail, source]);

  return (
    <main className="max-w-lg mx-auto pt-16">
      <h1 className="text-2xl font-semibold mb-4">Validation en attente</h1>
      <p className="mb-4">
        {source === "signup"
          ? "Un email de confirmation vous a été envoyé — votre compte est désormais en attente d'approbation par l'administrateur."
          : "Votre compte est en attente d'approbation par l'administrateur. Vous recevrez un email dès que votre accès sera validé."}
      </p>

      <div className="mt-6">
        {status === "sending" && <p>Envoi de l'email de confirmation...</p>}
        {status === "ok" && <p className="text-green-600">{message}</p>}
        {status === "error" && (
          <div className="flex flex-col gap-4">
            <p className="text-red-600">{message}</p>

            <button type="button" onClick={sendValidationEmail}>
              Renvoyer l'email
            </button>
          </div>
        )}
        {status === "idle" && source !== "signup" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              Vous n'avez pas reçu l'email de confirmation ?
            </p>
            <button
              type="button"
              onClick={sendValidationEmail}
              className="w-fit"
            >
              Renvoyer l'email
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
