import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import BackButton from "@/components/BackButton";

export default function RegisterPage() {
  return (
    <div className="pt-24 pb-10 max-w-4xl mx-auto px-4">
      <BackButton />
      <RegistrationForm />
    </div>
  );
}
