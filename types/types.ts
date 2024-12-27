import { StyleProp, ViewStyle } from 'react-native'

export type CardProps = Readonly<{
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  blurIntensity?: number
}>

export interface LogoFooterProps {
  addedStyles?: StyleProp<ViewStyle>
}
export interface Agency {
  Id: string
  Name: string
}

export interface UserPhotos {
  picture: string
  thumbnail: string
}

export interface UserStatus {
  body: string | null
  created_date: string | null
}

export interface UserUrls {
  custom_domain: string
  enterprise: string
  feed_elements: string
  feed_items: string
  feeds: string
  groups: string
  metadata: string
  partner: string
  profile: string
  query: string
  recent: string
  rest: string
  search: string
  sobjects: string
  tooling_rest: string
  tooling_soap: string
  users: string
}

export interface UserInfo {
  active: boolean
  addr_city: string | null
  addr_country: string | null
  addr_state: string | null
  addr_street: string | null
  addr_zip: string | null
  asserted_user: boolean
  display_name: string
  email: string
  email_verified: boolean
  first_name: string
  id: string
  is_app_installed: boolean
  is_lightning_login_user: boolean
  language: string
  last_modified_date: string
  last_name: string
  locale: string
  mobile_phone: string | null
  mobile_phone_verified: boolean
  nick_name: string
  organization_id: string
  photos: UserPhotos
  status: UserStatus
  timezone: string
  urls: UserUrls
  user_id: string
  user_type: string
  username: string
  utcOffset: number
}

export interface TokenResponse {
  access_token: string
  id: string
  instance_url: string
  issued_at: string
  signature: string
  token_type: string
}

export interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  tokenData: TokenResponse | null
  setAuthState: (
    isAuthenticated: boolean,
    userInfo: UserInfo | null,
    tokenData: TokenResponse | null,
  ) => Promise<void>
  clearAuthState: () => Promise<void>
  loadAuthState: () => Promise<void>
  isBiometricEnabled: boolean
  setBiometricEnabled: (
    enabled: boolean,
    username?: string,
    password?: string,
  ) => Promise<void>
  loadBiometricState: () => Promise<void>
  getBiometricCredentials: () => Promise<{
    username: string
    password: string
  } | null>
}

export interface Address {
  street: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  geocodeAccuracy: string | null
  latitude: number | null
  longitude: number | null
}

export interface Attributes {
  type: string
  url: string
}

export interface Account {
  attributes: Attributes
  Id: string
  IsDeleted: boolean
  MasterRecordId: string | null
  Name: string
  Type: string
  ParentId: string | null
  BillingStreet: string
  BillingCity: string
  BillingState: string
  BillingPostalCode: string
  BillingCountry: string
  BillingLatitude: number | null
  BillingLongitude: number | null
  BillingGeocodeAccuracy: string | null
  BillingAddress: Address
  ShippingStreet: string
  ShippingCity: string
  ShippingState: string
  ShippingPostalCode: string
  ShippingCountry: string
  ShippingLatitude: number | null
  ShippingLongitude: number | null
  ShippingGeocodeAccuracy: string | null
  ShippingAddress: Address
  Phone: string
  Fax: string | null
  Website: string
  PhotoUrl: string
  Industry: string
  NumberOfEmployees: number
  Description: string | null
  OwnerId: string
  CreatedDate: string // ISO 8601 format
  CreatedById: string
  LastModifiedDate: string // ISO 8601 format
  LastModifiedById: string
  SystemModstamp: string // ISO 8601 format
  LastActivityDate: string | null // ISO 8601 format
  LastViewedDate: string | null // ISO 8601 format
  LastReferencedDate: string | null // ISO 8601 format
  IsCustomerPortal: boolean
  Jigsaw: string | null
  JigsawCompanyId: string | null
  AccountSource: string | null
  SicDesc: string | null
  AnnualRevenue: number | null

  // Custom Fields (ending with __c)
  Agency_Office_Code__c: string | null
  Legacy_PIF__c: string | null
  Entity_Type__c: string | null
  Tax_Id__c: string | null
  Tax_Name__c: string | null
  Reason_for_Termination__c: string | null
  Parent_Agency__c: string | null
  Comparative_Rater_Used__c: string | null
  Other_Rater__c: string | null
  Broker_Status__c: string | null
  E_O_Status__c: string | null
  Bond_with_CDI__c: string | null
  Premium_Trust_Acct__c: string | null
  Premium_Trust_Routing__c: string | null
  Operating_Acct__c: string | null
  Operating_Routing__c: string | null
  Other_Acct__c: string | null
  Other_Routing__c: string | null
  Red_Flags_Misc_Judgements__c: string | null
  Email__c: string | null
  Agency_Email__c: string | null
  Ultimate_Parent__c: string | null
  Territory__c: string | null
  Not_Reinstatable__c: boolean
  Bridger_Assume_PIFs__c: boolean
  Ride_Share_Coverage_Requests__c: string | null
  CaseSafeId__c: string | null
  Account_Number_matches_EFT_Agreement__c: boolean
  Any_Bankruptcy__c: boolean
  Any_Felony__c: boolean
  Appointments__c: string | null
  Ultimate_Parent_Agency__c: string | null // Contains HTML string
  Approval_Signature_on_page_3_of_PA__c: boolean
  Are_there_Other_Offices__c: string | null
  Broker_Comm_Deposit_Auth_Signature_TX__c: boolean
  Business_under_Licensed_DBA_Name__c: boolean
  Copy_of_void_check_statement_letter__c: boolean
  CPQ_Signature_Page_3__c: boolean
  CPQ_Signature_Page_4__c: boolean
  CPQ_Signature_Page_5__c: boolean
  Current_Carrier_1__c: string | null
  Current_Carrier_2__c: string | null
  Current_Carrier_3__c: string | null
  Current_Carrier_4__c: string | null
  EFT_Agreement_Signature__c: boolean
  Estimated_Bridger_Montly_Volume__c: string | null
  Expiration_Date_in_the_Future_E_O__c: boolean
  How_did_you_hear_of_Bridger_Ins_Svcs__c: string | null
  License_Date_Accepted__c: boolean
  License_Revocation_Date__c: string | null
  License_Status__c: string | null
  Name_under_Licensed_DBA_Name_E_O__c: boolean
  Name_under_Licensed_DBA_Name_excl_TX__c: boolean
  Name_under_Licensed_DBA_Name_TX__c: boolean
  Number_of_Principals__c: string | null
  Obligee_CA_DOI__c: boolean
  Other_Business_Activities__c: string | null
  Owner_Endorsement__c: string | null
  Personal_Guaranty_Signature__c: boolean
  Personal_Guaranty_Witness__c: boolean
  Prior_Business_Names__c: string | null
  Prior_Business_with_Bridger__c: string | null
  Producer_Questionnaire_Approval__c: string | null
  Producer_Questionnaire_Denial_Reason__c: string | null
  Reason_s_Terminated_Restricted__c: string | null
  Reason_for_License_Revocation__c: string | null
  Resume_if_less_than_2_yrs_of_experience__c: boolean
  Routing_Number_matches_EFT_Agreement__c: boolean
  Signature_TX__c: boolean
  PA_Signature_page_3_and_page_5__c: boolean
  Sources_of_Business__c: string | null
  Taxpayer_Identification_Number__c: boolean
  Term_Restricted_Insurance_Companies__c: string | null
  Terminated_Restricted_Authority__c: string | null
  Verified_on_CDI_Website__c: boolean
  W9_Business_Name_Match__c: boolean
  W9_SSN_EIN_Match__c: boolean
  Years_of_Experience__c: string | null
  Use_Office_Mailing_Address__c: boolean
  Legacy_WP__c: string | null
  Legacy_LR__c: string | null
  Legacy_FREQ__c: string | null
  PolicyOne_FREQ__c: string | null
  PolicyOne_LR__c: string | null
  PolicyOne_Policies_in_Force__c: string | null
  PolicyOne_Written_Premium__c: string | null
  CaseSafeIdTxt__c: string | null
  Avg_of_Policies_Per_Month__c: string | null
  Annual_Premium_Estimate__c: string | null
  Agent_Segment__c: string | null
  NS_Contracts__c: string | null
  Monthly_Auto_Apps__c: string | null
  Agency_Management_System__c: string | null
  Agency_Driver__c: string | null
  Product_Driver__c: string | null
  Preferred_Term__c: string | null
  Percent_Liability__c: string | null
  Hot_Buttons__c: string | null
  Auto_Market_1__c: string | null
  Auto_Market_2__c: string | null
  Auto_Market_3__c: string | null
  Auto_Market_4__c: string | null
  Auto_Market_5__c: string | null
  Higher_Limits_Writer__c: boolean
  Promo_Incentivized__c: string | null
  agentsync__AgentSync_Attempt__c: string | null
  agentsync__AgentSync_Audit_Log__c: string | null
  agentsync__AgentSync_Producer_Assignment__c: string | null
  agentsync__AgentSync_QueuedJobId__c: string | null
  agentsync__AgentSync_Status_Icon__c: string | null // HTML string
  agentsync__AgentSync_Status__c: string | null
  agentsync__AgentSync_Success__c: string | null
  agentsync__AgentSync_Tracking__c: string | null
  agentsync__ID_FEIN__c: string | null
  agentsync__NAME_COMPANY__c: string | null
  agentsync__NPN__c: string | null
  agentsync__Related_Company__c: string | null
  agentsync__STATE_DOMICILE__c: string | null
  DBA__c: string | null
  Contact_Name__c: string | null
  Principal_Cell_Phone__c: string | null
  Would_you_like_announcements__c: boolean
  Years_Owned_Business__c: string | null
  Year_Formed__c: string | null
  Ever_subject_to_discipline__c: string | null
  E_O_Carrier__c: string | null
  E_O_Limit__c: string | null
  E_O_Deductible__c: string | null
  E_O_Effective_Date__c: string | null // ISO 8601 format
  E_O_Expiration_Date__c: string | null // ISO 8601 format
  Trust_Account_Bank_Name__c: string | null
  Trust_Account_Address__c: string | null
  Trust_Account_City__c: string | null
  Trust_Account_State__c: string | null
  Trust_Account_Zip__c: string | null
  Operating_Account_Bank_Name__c: string | null
  Operating_Account_Address__c: string | null
  Operating_Account_City__c: string | null
  Operating_Account_State__c: string | null
  Operating_Account_Zip__c: string | null
  Preferred_Carriers_Represented__c: string | null
  Specilty_Carriers_Represented__c: string | null
  Association_Membership__c: string | null
  Trust_and_Operating_account_are_Same__c: boolean
  Billing_and_Mailing_Address_are_Same__c: boolean
  Disciplinary_Action_Reason__c: string | null
  Year_Founded__c: string | null
  Owner_Cell_Phone__c: string | null
  Multiple_Locations__c: boolean
  E_O_Policy_Number__c: string | null
  Agency_License_Number__c: string | null
}

export interface UseAccountDetailsReturn {
  account: Account | null
  loading: boolean
  error: string | null
}
