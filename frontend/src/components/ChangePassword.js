import React from 'react';
import { 
  Button,
  Column,
  Form,
  FormLabel,
  Grid,
  Heading,
  ListItem,
  Section,
  Stack,
  TextInput,
  UnorderedList,
  
} from '@carbon/react';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';

function ChangePassword() {
  const intl = useIntl();

  const LoginComlexityMessage = () => {
    return(
      <>
        <h5>
          <FormattedMessage id="login.complexity.message" />
        </h5>
        <br/>
        <h6>
          <UnorderedList nested={true}>
            <ListItem>
              <FormattedMessage id="login.complexity.message.1" />
            </ListItem>
            <ListItem>
              <FormattedMessage id="login.complexity.message.2" />
            </ListItem>
            <ListItem>
              <FormattedMessage id="login.complexity.message.3" />
            </ListItem>
            <ListItem>
              <FormattedMessage id="login.complexity.message.4" />
            </ListItem>
          </UnorderedList>
        </h6>
      </>
    )
  }


  return (
    <>
      <div className='changePasswordPage'>
        <Grid fullWidth={true}>
          <Column lg={0} md={0} sm={4}>
            <LoginComlexityMessage/>
          </Column>
          <Column  lg={6} md={4} sm={4}>
            <Section>
              <Form>
                <Stack gap={5}>
                  <FormLabel>
                    <Heading>
                      <FormattedMessage id="label.button.changepassword" />
                    </Heading>
                  </FormLabel>
                  <TextInput
                    id="username"
                    labelText={intl.formatMessage({id: "login.msg.username",})}
                    hideLabel={true}
                    placeholder={intl.formatMessage({id: "login.msg.username",})}
                  />
                  <TextInput.PasswordInput
                    id="current-password"
                    labelText={intl.formatMessage({id: "login.login.current.password",})}
                    hideLabel={true}
                    placeholder={intl.formatMessage({id: "login.login.current.password",})}
                  />
                  <br/>
                  <TextInput.PasswordInput
                    id="new-password"
                    labelText={intl.formatMessage({id: "login.login.new.password",})}
                    hideLabel={true}
                    placeholder={intl.formatMessage({id: "login.login.new.password",})}
                  />
                  <TextInput.PasswordInput
                    id="repeat-new-password"
                    labelText={intl.formatMessage({id: "login.login.repeat.password",})}
                    hideLabel={true}
                    placeholder={intl.formatMessage({id: "login.login.repeat.password",})}
                  />
                  <Stack orientation="horizontal">
                    <Button>
                      <FormattedMessage id="label.button.submit" />
                    </Button>
                    <Button
                      kind="secondary"
                      onClick={() => {
                        window.location.href = "/";
                      }}
                    >
                      <FormattedMessage id="label.button.exit" />
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            </Section>
          </Column>
          <Column  lg={10} md={4} sm={0}>
            <LoginComlexityMessage/>
          </Column>
        </Grid>
      </div>
    </>
  )
}

export default injectIntl(ChangePassword);
