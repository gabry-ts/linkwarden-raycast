import { useState, useEffect } from "react";
import { Action, ActionPanel, Form, useNavigation, LocalStorage, showToast, Toast } from "@raycast/api";

export default function Command() {
  const { pop } = useNavigation();
  const [host, setHost] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    async function loadSettings() {
      const savedHost = await LocalStorage.getItem<string>("linkwarden_host");
      const savedToken = await LocalStorage.getItem<string>("linkwarden_token");
      setHost(savedHost || "");
      setToken(savedToken || "");
    }
    loadSettings();
  }, []);

  async function handleSubmit(values: { host: string; token: string }) {
    try {
      await LocalStorage.setItem("linkwarden_host", values.host);
      await LocalStorage.setItem("linkwarden_token", values.token);
      showToast({
        style: Toast.Style.Success,
        title: "Settings saved successfully",
      });
      pop();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to save settings",
        message: (error as Error).message,
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Settings" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="host"
        title="Linkwarden Host"
        placeholder="https://your-linkwarden-instance.com"
        value={host}
        onChange={setHost}
      />
      <Form.PasswordField
        id="token"
        title="API Token"
        placeholder="Your Linkwarden API token"
        value={token}
        onChange={setToken}
      />
    </Form>
  );
}
