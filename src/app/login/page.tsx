import LoginForm from "./LoginForm";
import FormCard from "../components/ui/FormCard";

export default function LoginPage() {
  return (
    <FormCard title="Connexion" subtitle="Accédez à votre espace Studio DR">
      <LoginForm />
    </FormCard>
  );
}
