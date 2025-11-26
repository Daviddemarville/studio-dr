import FormCard from "@/app/(public)/components/ui/FormCard";
import { LoginForm } from "@/app/auth/signIn/_components/login-form";

export default function signIn() {
  return (
    <FormCard title="Connexion" subtitle="Accédez à votre espace Studio DR">
      <LoginForm />
    </FormCard>
  );
}
