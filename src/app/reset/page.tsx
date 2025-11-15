import ResetRequestForm from "./ResetRequestForm";
import FormCard from "../components/ui/FormCard";

export default function ResetPage() {
  return (
    <FormCard title="Mot de passe oublié" subtitle="Recevez un lien par email">
      <ResetRequestForm />
    </FormCard>
  );
}
