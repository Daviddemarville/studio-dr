import FormCard from "../components/ui/FormCard";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <FormCard title="Connexion" subtitle="Accédez à votre espace Studio DR">
      <LoginForm />
    </FormCard>
  );
}
