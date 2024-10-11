export interface IProperty {
  id_property?: number
  title?: string
  cod_unique?: string
  id_type?: number
  citys?: string
  negotiation?: TipoOperacao
  neighborhoods?: string
  useful_area?: number
  address?: string
  sale_value?: any
  dormitory_number?: number
  vacancies?: number
  suites?: number
  name_table?: string
  link_table?: string
  description?: string
  deleted_at?: any
  created_at?: string
  updated_at?: string
  propertys_images?: PropertysImage[]
  images?: PropertysImage[]
  propertys_type?: PropertysType
}

export interface PropertysImage {
  url?: string
  emphase?: number
  id_propertys_images?: number
}

export interface PropertysType {
  id_propertys_type: number
  name: string
  propertys_type: string
}

export interface IConfidencial {
  reference?: string;
  name?: string;
  email?: string;
  cell_phone?: string;
  observations?: string;
  nameCJ?: string;
  emailCJ?: string;
  telephoneCJ?: string;
  codeIPTU?: string;
  registration_number?: string;
  electricity_code?: string;
  water_code?: string;
  documentation_observation?: string;
  titles_rights?: string;
  projects_approved?: boolean;
  approved_environmental_agency?: boolean;
}
export interface IAnuncio {
  web_advertisement?: boolean;
  emphasis?: boolean;
  super_highlight?: boolean;
  portals?: string;
  title?: string;
  characteristics_of_the_property?: string;
  differences?: string;
  leisure_area?: string;
  privileged_location?: string;
  location?: string;
  advertising_in_print_media?: boolean;
  printed_media?: string;
  printed_media_description?: string;
  sign_on_site?: boolean;
  placement_request?: string;
  placement_date?: string;
  withdrawal_request?: string;
  withdrawal_date?: string;
}
export interface IDadosprim {
  reference?: string;
  sale?: number;
  sale_valuation?: number;
  rental?: number;
  rental_evaluation?: number;
  condominium?: number;
  leased?: boolean;
  accommodates_how_many_people?: number;
  type_of_rental?: string;
  dt_evaluatio?: string;
  useful_built_area?: number;
  common_area?: number;
  private_area?: number;
  total_land_area?: number;
  go_free?: number;
  auth_to_negotiate?: boolean;
  end_of_authorization?: string;
  exclusive?: boolean;
  end_of_exclusive?: string;
  registered_by?: string;
  alternative_reference?: string;
  status?: boolean;
  type?: string;
  purpose?: string;
  name?: string;
  standard?: string;
  zoning?: string;
  gated_condominium?: boolean;
  default_location?: string;
  IPTU_value?: number;
  year_construction?: number;
  reform_year?: number;
  used_FGTS_in_the_last_3_years?: boolean;
  accept_exchange?: boolean;
  accept_financing?: boolean;
  situation?: string;
  needs_renovation?: string;
  rental_guarantee_accepted_by_the_owner?: string;
  internal_comments?: string;
  commercial_condition?: string;
  nearby_meters?: string;
  pickup?: string;
  files?: string;
  pass_on_promotion_payment_conditions?: string;
  method_of_paying_the_outstanding_balance?: string;
}
export interface IDetails {
  total_area_land?: number;
  built_useful?: number;
  common_area?: number;
  private_area?: number;
  external_area?: number;
  maneuvering_area?: number;
  patio_area?: number;
  go_free?: number;
  Topography?: string;
  Property_face?: string;
  property_position?: string;
  cabinets?: string;
  floor?: string;
  intimate?: string;
  social?: string;
  leisure?: string;
  services?: string;
  infrastructure?: string;
}

export enum TipoOperacao {
  Venda = 'venda',
  Locacao = 'locacao',
} 