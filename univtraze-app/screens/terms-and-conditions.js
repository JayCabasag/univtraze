import { KeyboardAvoidingView, Image, StyleSheet, TextInput, View, TouchableOpacity, Text, StatusBar, Modal } from 'react-native'
import Checkbox from 'expo-checkbox'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ConfettiCannon from 'react-native-confetti-cannon'
import ModalSuccess from 'react-native-modal'
import { Dimensions } from 'react-native'
import { ScrollView } from 'react-native'

const TermsAndConditions = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#E1F5E4' }}>
      <StatusBar animated={true} backgroundColor='#E1F5E4' barStyle='dark-content' />
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <ScrollView style={{ height: windowHeight }}>
          <View style={{ width: '100%' }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Terms Conditions</Text>
            <Text>
              UnivTraze Contact Tracing is an application that can perform the contact tracing of individuals and all the persons whom he
              got in contact within seconds. UnivTraze Contact Tracing application software is developed and owned Mr. Edmar G. Tan and
              development team.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>1. This is a Contract</Text>
            <Text>
              Please read these Terms carefully. They constitute a contract between you and UnivTraze Contact Tracing application. You may
              not use the software application if you do not accept these Terms. By using the UnivTraze Contact Tracing application you
              accept these Terms.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>2. The Content is not provided by UnivTraze Contact Tracing.</Text>
            <Text>
              UnivTraze Contact Tracing does not investigate, monitor, or check the correctness and accuracy of the information entered by
              all registered end users or parties offering the Content. You agree that UnivTraze Contact Tracing is not responsible or
              liable for the Content.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>3. You must obey the law and respect the rights of others.</Text>
            <Text>
              You must not use UnivTraze Contact Tracing application to violate or infringe the rights of any other person, including the
              rights of other users and UnivTraze Contact Tracing’s rights in the application. You must not breach any laws or regulations
              when using UnivTraze Contact Tracing or attempt to disrupt or interfere with the security or functionality of Application.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>4. Your privacy is important to us.</Text>
            <Text>
              UnivTraze Contact Tracing takes the matters of protection and security of its users’ information very seriously. UnivTraze
              Contact Tracing will treat any and all such information it collects in accordance with its privacy statement. The Privacy
              Statement is incorporated into these Terms by this reference Privacy Policy . You agree to the use of your data in accordance
              with UnivTraze Contact Tracing Privacy Policy Statement. The Privacy Statement addresses only the information collected by
              UnivTraze Contact Tracing in its contact tracing process.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>5. UnivTraze Contact Tracing may modify these Terms.</Text>
            <Text>
              These Terms, including the Privacy Policy Statement, may be modified by UnivTraze Contact Tracing without notice at any time
              in the future. It is your responsibility to remain informed of any changes as you are bound by the latest version of these
              Terms.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              6. UnivTraze Contact Tracing collects and processes data for objectively justifiable purposes.
            </Text>
            <Text>
              UnivTraze Contact Tracing only process your data for purposes that are objectively justified by UnivTraze Contact Tracing
              application and only as stated in this Privacy Statement. We process this data with respect to your right to privacy,
              including the need to protect personal integrity and private life and to ensure that your personal data is adequately
              protected against the risk of loss, misuse and unintended alteration. UnivTraze Contact Tracing collects data to administer
              your registration content/apps access or submission rights, provide contact tracing status, updates and access control,
              measure activity with content apps provided through our service, send you service notifications, serve ads in the content apps
              based on your location and fulfill legal requirements.
            </Text>

            <Text style={{ fontWeight: 'bold' }}>
              7. UnivTraze Contact Tracing and its developer may discontinue access to the Application.
            </Text>

            <Text style={{ fontWeight: 'bold' }}>8. The Application is provided without any warranties or guarantees.</Text>
            <Text>
              THE APPLICATION IS PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND. UnivTraze CONTACT TRACING AND ITS DEVELOPER DISCLAIM ALL
              WARRANTIES WITH REGARD TO THE SERVICE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT. UnivTraze CONTACT TRACING DOES NOT REPRESENT OR WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR
              ERROR FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR
              OTHER HARMFUL COMPONENTS. UnivTraze CONTACT TRACING DOES NOT WARRANT OR REPRESENT THAT THE USE OR THE RESULTS OF THE USE OF
              THE SERVICE OR THE MATERIALS MADE AVAILABLE ON OR ACCESSIBLE THROUGH THE APPLICATION (INCLUDING CONTENT) WILL BE CORRECT,
              ACCURATE, TIMELY, OR OTHERWISE RELIABLE. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE APPLICATION, OR WITH ANY OF THESE
              TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE APPLICATION.
            </Text>

            <Text style={{ fontWeight: 'bold' }}>
              9. UnivTraze Contact Tracing is not liable for any damages you may incur as a result of using the Services.
            </Text>
            <Text>
              IN NO EVENT SHALL UnivTraze CONTACT TRACING OR ITS DEVELOPER BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA, OR
              PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SERVICE, WITH THE DELAY OR INABILITY TO USE
              THE SERVICE, THE PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY CONTENT OBTAINED THROUGH THE SERVICE, OR OTHERWISE
              ARISING OUT OF THE USE OF THE APPLICATION, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN
              IF UnivTraze CONTACT TRACING OR ANY OR ITS DEVELOPER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </Text>

            <Text style={{ fontWeight: 'bold' }}>
              10. The Application is provided by a Filipino owned company i.e. Cosmotech Philippines, Inc. and this contract is based on
              Philippine law.
            </Text>
            <Text>
              This Agreement will be governed by the laws of the Philippines without giving effect to any conflicts of law principles that
              may require the application of the laws of a different country. If any provision of this Agreement is determined by a court of
              competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions of this Agreement shall not be
              affected or impaired thereby.
            </Text>

            <Text style={{ fontWeight: 'bold' }}>11. Notice to rights holders.</Text>
            <Text>
              If you believe that Content accessible via the application infringes your rights, you may submit a notification to
              ramdenat@univtraze.net which you provide the following information: (a) identification of the rights/works that are being
              infringed upon; (b) identification of the Content that is infringing your rights (including URL(s) for the Content); (c) your
              name, address, telephone number, and electronic mail address; (d) a statement that you have a good faith belief that use of
              the Content in the manner complained of is not authorized by the rights holder, its agent, or the law; (e) a statement that
              the information in the notification is accurate and, under penalty of perjury, that you are authorized to act on behalf of the
              owner of an exclusive right that is allegedly infringed.
            </Text>

            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>PRIVACY POLICY</Text>
            <Text>
              UnivTraze is a university-wide contact tracing app that automates manual contact tracing by using QR code scanning such that
              the tracing process done in several days can now be achieved in just few minutes.
            </Text>
            <Text>
              An in-app notification will be sent to all who may have come in contact with an identified Covid-19 positive patient so that
              they can observe precautions and start self-isolation if symptoms occur to protect their families and loved ones.
            </Text>
            <Text>
              UnivTraze is an application develop for the dissertation of Mr. Edmar G. Tan, a student of Rizal Technological university,
              philippines.
            </Text>
            <Text>
              UnivTraze Contact Tracing aims for full transparency about the personal data that it processes when you use this application.
              Pursuant to the Republic Act No. 10173 (Data Privacy Act), this Privacy Statement explains, among other things, what
              information we collect, why we collect it, and how we use the information.
            </Text>
            <Text>
              The Privacy Statement applies to all end users of UnivTraze Contact Tracing App: students, faculty and non-teaching staff and
              visitors of the university.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>1. WHAT DATA WE COLLECT</Text>
            <Text>DATA RELATING TO END USERS</Text>
            <Text>
              Some of the information we process may be considered personal data under applicable privacy legislation. This personal
              information includes:
            </Text>
            <Text>- User name/ ID – is a unique identifier to be used by individual to login to UnivTraze App.</Text>
            <Text>
              - Password – to secure the individual account in UnivTraze app. Only the registered individual can see and modify their
              password.
            </Text>
            <Text>
              - Last Name, First Name – used for proper verification when UnivTraze QR codes are being scanned and to be used by authorities
              for successful contact tracing.
            </Text>
            <Text>- Contact number – so authorities will be able to contact the individual when doing contact tracing.</Text>
            <Text>- Country/Town City of Residence – authorities may group based on location when doing contact tracing.</Text>
            <Text>- E-mail Address - to be used by the user in retrieving their password.</Text>
            <Text>
              - ID picture that is locally saved in the mobile phone – used for visual confirmation when UnivTraze QR Code are being
              scanned.
            </Text>
            <Text>
              - Device’ Camera – to be used by UnivTraze App user to capture a picture for his/her profile and for reading UnivTraze QR
              Codes of other individual and establishments. Captured picture will be saved to device’ local storage and will be used for
              visual confirmation of identity of the user when his/her UnivTraze QR Code is being scanned by the authorities. UnivTraze app
              does not record video when using the device’ camera.
            </Text>
            <Text>
              - Device’ Storage, Files and Images – will only be accessed as an option by the user to upload his/her profile picture.
              UnivTraze app has no capabilities to use or access videos and/or any other file types stored in the device. UnivTraze app will
              access the device local storage, upon user approval, to store the uploaded profile picture and transaction data. Transaction
              data will be used by the authorities when doing contact tracing while profile picture will not be uploaded to the server.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>2. WHY WE PROCESS PERSONAL DATA AND THE LEGAL BASIS FOR OUR PROCESSING</Text>
            <Text>
              We only process your data for purposes that are objectively justified by UnivTraze Contact Tracing application and only as
              stated in this Privacy Statement. We process this data with respect to your right to privacy, including the need to protect
              personal integrity and private life and to ensure that your personal data is adequately protected against the risk of loss,
              misuse and unintended alteration.
            </Text>
            <Text>
              Unless you are offered the option to provide prior consent to our use of your data, we process your data with legal basis in
              the DATA Privacy Act (DPA) RA 10173 - Section 12. Criteria for Lawful Processing of Personal Information. We collect data for
              the contact tracing of individuals and all the persons whom he got in contact with, given that they are registered under the
              UnivTraze Contact Tracing App
            </Text>
            <Text style={{ fontWeight: 'bold' }}>INFORMATION YOU GIVE TO US</Text>
            <Text>For end users (Individuals) , we collect data to :</Text>
            <Text>- Administer your registration content/apps access or submission rights</Text>
            <Text>- Provide contact tracing status, updates and access control</Text>
            <Text>- Measure activity within the apps provided through our service</Text>
            <Text>- Send you service notifications</Text>
            <Text>- Fulfill legal requirements</Text>
            <Text>
              For our partners (Establishments, Government Agencies, Delivery Crew, Barangay, Transportation and Ports), we collect data to:
            </Text>
            <Text>- Administer your registration content/apps access or submission rights</Text>
            <Text>- Provide you important notifications</Text>
            <Text>- Provide statistical data</Text>
            <Text style={{ fontWeight: 'bold' }}>INFORMATION WE RECEIVE FROM OTHER SOURCES</Text>
            <Text>
              We work closely with third party service providers and may receive information about you from them. These service providers
              collect usage data in compliance with their privacy policies.{' '}
            </Text>
            <Text style={{ fontWeight: 'bold' }}>3. HOW WE COLLECT DATA</Text>
            <Text>Generally, we collect data:</Text>
            <Text>
              When you provide them explicitly to us, during your registration. Username and password are used for system log-in validation
              and password can be changed anytime by the users.
            </Text>
            <Text>
              - When you scan the QR code of another individual, establishment, transportation, delivery crew, government agencies and
              barangay.
            </Text>
            <Text>
              When we collect your data at end user level, we saved your critical information locally such as the your QR Code, your
              picture, history of scanned individuals, establishments, transportation, delivery crew, barangays, etc. We save the collected
              data in UnivTraze Contact Tracing server which are then used for Contact Tracing process. This string equivalent of your
              collected data are encrypted when transferred to our UnivTraze Contact Tracing server.
            </Text>
            <Text>
              We ask the following permissions specifically to get your ID picture that will be saved locally in your mobile phone:
            </Text>
            <Text>
              Access to Phone’s Camera. UnivTraze Contact Tracing requests access to individual phone’s camera primarily to capture his
              image that will be saved locally in his phone together with his profile and QR Code as part of his identification when he
              presents his UnivTraze QR Code.
            </Text>
            <Text>
              Access to Phone’s Photo or Photo File. Trace Contact Tracing also requests access to individual’s phone photo to allow
              selection of image or picture during registration that will form part of his identification together with the QR Code.
            </Text>
            <Text>
              Captured image via phone’s camera upon the individual’s permission or copied image from phone’s photo file, also upon the
              individual’s approval, will be saved locally to individual’s phone together with his generated QR Code and personal profile.
              UnivTraze Contact Tracing retains the captured ID picture or image locally in the individual’s phone for his identification.
              ID picture or uploaded image is not part of the file data in the server that UnivTraze kept for contact tracing.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>4. INFORMATION SECURITY – HOW WE PROTECT YOUR DATA from unauthorized access</Text>
            <Text>
              In order to prevent unauthorized access or disclosure, we have put in place suitable technical handling to safeguard and
              secure the information we collect online. We have implemented organizational and technical procedures and measures that will
              ensure that your personal data is not compromised, not unintentionally changed, and available when required. Such measures
              include data encryption when we save your information, one time password (OTP) during your registration, user password during
              system log in, access restrictions and controls, back up routines, and disaster recovery routines.
            </Text>
            <Text>
              We review and update our working procedures regularly to improve your privacy and ensure that our internal policies are
              followed. We strive to promptly correct any non-conformance with these policies.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>5. HOW WE SHARE YOUR DATA</Text>
            <Text>We may share your data:</Text>
            <Text>- To government bodies and law enforcement agencies to comply with the law, by court order or other legal process;</Text>
            <Text>- To third parties to enforce or defend our legal rights, including our terms of service.</Text>
            <Text>
              - To data processors processing the data on our behalf, cloud storage providers and providers of analytics services; and
            </Text>
            <Text>- As described elsewhere in this statement.</Text>
            <Text style={{ fontWeight: 'bold' }}>6. RETENTION AND DELETION</Text>
            <Text>
              We retain personal data only as long as necessary for processing it in accordance with the purposes described in this
              statement, or as otherwise necessary to comply with applicable laws. We retain the history of your scanning transactions for
              only (30) thirty days. When your data is no longer necessary or relevant for our purposes, or required by applicable laws, we
              take steps to have it deleted.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>7. ACCESS, CORRECTION AND DELETION OF PERSONAL DATA</Text>
            <Text>
              You have the right to access the personal data you have registered about you. For profile information, if any of the
              information you have registered is incorrect, we encourage you to make changes to your profile (Last Name, First Name, Email,
              Location/ City/ Country, Cellphone number, Nickname). You may also withdraw any consents you have given at any time. Feel free
              to contact us for assistance at mobile number (+639) 2944-80134 or email us at ramdenat@univtraze.net
            </Text>
            <Text>
              Personal Information of Individual will be retained in the Masterfile until the individual deletes its own personal record via
              mobile app. Personal Information of the individual together with his scanning history shall be deleted locally in his mobile
              app immediately upon deletion of his record. However, his personal record and corresponding scanning transactions will be
              retained in the server for thirty (30) days which will be used by the organization or agency for contact tracing. His record
              will be automatically deleted from the server after thirty (30) days from the date of its deletion from the mobile app.
            </Text>
            <Text>
              Individual scanning transactions will be retained for thirty (30) days and will be automatically deleted by the system after
              thirty days.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>8. YOUR RIGHT TO FILE A COMPLAINT</Text>
            <Text>
              If you believe that we process your data in violation of your rights, you have the right to complain. You may always contact
              us directly at telephone number (02) 8403-98-11 before sending a complaint to the National Privacy Commission (NPC) office, so
              that we can try to solve or clarify the issue.
            </Text>
            <Text style={{ fontWeight: 'bold' }}>9. CONTROLLER, PROCESSOR AND CONTACT INFORMATION</Text>
            <Text>UnivTraze Contact Tracing is owned, developed and managed by Mr. Edmar G. Tan and their development team.</Text>
            <Text style={{ fontWeight: 'bold' }}>
              If you have any questions about the Privacy Statement or any other questions regarding our privacy practices, please contact
              us at: ramdenat1987@univtraze.net
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Return to sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default TermsAndConditions

const windowWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('screen').height

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'transparent'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#4d7861'
  },
  image: {
    justifyContent: 'center',
    width: '100%',
    height: 200,
    resizeMode: 'center'
  },

  imageContainer: {
    width: '100%',
    height: 'auto'
  },

  container: {
    flex: 1,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  label: {
    color: '#4d7861',
    marginLeft: 41
  },

  input: {
    margin: 5,
    height: 50,
    width: 340,
    borderColor: '#7a42f4',
    paddingHorizontal: 15,
    borderWidth: 0.1,
    borderRadius: 2,
    marginLeft: 41,
    marginRight: 41,
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  inputContainer: {
    backgroundColor: 'transparent'
  },
  button: {
    backgroundColor: '#28CD41',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    marginTop: 5,
    paddingVertical: 18,
    alignSelf: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  loginText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#364D39',
    fontSize: 30,
    lineHeight: 30,
    textTransform: 'uppercase',
    marginLeft: 41,
    paddingVertical: 30
  },
  forgotPassword: {
    textAlign: 'right',
    marginRight: 41,
    textDecorationLine: 'underline',
    color: '#4d7861',
    paddingVertical: 7.5
  },
  orText: {
    color: '#4d7861',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 7.5
  },
  socialMediaContainer: {
    flexDirection: 'row',
    width: windowWidth,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  googleImage: {
    width: 50,
    height: 50,
    marginRight: 7
  },

  facebookImage: {
    width: 36,
    height: 36,
    marginTop: 4,
    marginLeft: 7
  },
  errorMessage: {
    textAlign: 'left',
    marginLeft: 41,
    color: 'red',
    paddingVertical: 7.5
  },
  buttonContinue: {
    backgroundColor: '#28CD41',
    padding: 10,
    borderRadius: 10,
    paddingVertical: 18,
    marginVertical: 15,
    width: 308,
    height: 60
  }
})
