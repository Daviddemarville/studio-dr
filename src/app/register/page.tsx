import RegisterForm from "./RegisterForm";
import FormCard from "../components/ui/FormCard";

export default function RegisterPage() {
  return (
    <FormCard title="Créer un compte" subtitle="Rejoignez Studio DR">
      <RegisterForm />
    </FormCard>
  );
}
