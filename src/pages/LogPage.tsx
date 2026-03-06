import FormLogWrapper from "../components/formLogWrapper/FormLogWrapper";
import Layout from "../components/Layout";
import MainSectionLog from "../components/sections/MainSectionLog";

export default function LogPage() {
  return (
    <Layout showBreadcrumbs>
      <FormLogWrapper />
      <MainSectionLog />
    </Layout>
  );
}
