import {
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FieldApi, FormState, useField, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import PDF, { DownloadPDF } from "../components/PDF";
import { useGetInvoicesQuery } from "../api";
import Card from "../components/primitives/card";
import Text from "../components/primitives/text";
import QRCode from "qrcode";

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  console.log(field.state.meta.touchedErrors, "error");
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <FormErrorMessage>
          <Text>{field.state.meta.touchedErrors}</Text>
        </FormErrorMessage>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const NewInvoice = () => {
  const bgColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.4)");
  const textColor = useColorModeValue("black", "white");
  const { refetch, data, isLoading } = useGetInvoicesQuery();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });

  const firstNameField = useField({ form, name: "firstName" });

  console.log(data?.data?.IntuitResponse?.QueryResponse?.Invoice);

  const urlPromise = QRCode.toDataURL("https://www.npmjs.com/package/qrcode");

  return (
    <Flex gap={[2, 4, 4, 6, 8]} w={"full"}>
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          style={{ width: "100%" }}
        >
          <Flex direction="column" gap={4}>
            <Flex direction="column">
              {/* A type-safe field component*/}
              <form.Field
                name="firstName"
                validators={{
                  onChange: z
                    .string()
                    .min(3, "First name must be at least 3 characters"),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "No 'error' allowed in first name",
                    }
                  ),
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <FormLabel htmlFor={field.name} fontSize={"xs"}>
                        First Name:
                      </FormLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        bg={"white"}
                        color={"black"}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </Flex>
            <Flex direction="column">
              <form.Field
                name="lastName"
                children={(field) => (
                  <>
                    <FormLabel htmlFor={field.name} fontSize={"xs"}>
                      Last Name:
                    </FormLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      bg={"white"}
                      color={"black"}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </Flex>

            <form.Subscribe
              children={(state) => (
                <Button type="submit" disabled={!state.canSubmit}>
                  {state.isSubmitting ? "..." : "Submit"}
                </Button>
              )}
            />
          </Flex>
        </form>
        <DownloadPDF
          document={<PDF value={firstNameField.getValue()} />}
          fileName="invoice.pdf"
        />
      </Card>

      <Flex w={"full"}>
        <PDF value={firstNameField.getValue()} />
      </Flex>
      <Stack>
        <Button onClick={() => refetch()}>Fetch Invoices</Button>
        {isLoading ? (
          <Flex p={12}>
            {" "}
            <Text>Loading...</Text>
          </Flex>
        ) : (
          <Stack height={"500px"} overflow={"scroll"}>
            {data?.data?.IntuitResponse?.QueryResponse?.Invoice?.map(
              (invoice: any) => (
                <Flex p={12} gap={8}>
                  <Text>Id:{invoice.Id}</Text>
                  <Text>TotalAmt:{invoice.TotalAmt}</Text>
                </Flex>
              )
            )}
          </Stack>
        )}
      </Stack>
    </Flex>
  );
};

export default NewInvoice;
