import FormCard from "@/app/(public)/components/ui/FormCard";
import { SignUpForm } from "@/app/auth/signUp/_components/signup-form";

export default function signUpPage() {
  return (
    <FormCard
      title="Creer un compte"
      subtitle="Accédez à votre espace Studio DR"
    >
      <SignUpForm />
    </FormCard>
  );
}
