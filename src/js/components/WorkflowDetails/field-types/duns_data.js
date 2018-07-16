export const dunsData = {
  GetCleanseMatchResponse: {
    TransactionDetail: {
      ServiceTransactionID: "Id-e9a0f95842e36a003edf5d00a1502b23-1",
      TransactionTimestamp: "2017-04-21T02:04:25"
    },
    TransactionResult: {
      SeverityText: "Information",
      ResultID: "CM000",
      ResultText: "Success"
    },
    GetCleanseMatchResponseDetail: {
      InquiryDetail: {
        SubjectName: "Gorman Manufacturing",
        Address: {
          CountryISOAlpha2Code: "US",
          TerritoryName: "CA"
        }
      },
      MatchResponseDetail: {
        MatchDataCriteriaText: { $: "Name and Address Lookup" },
        CandidateMatchedQuantity: 6,
        MatchCandidate: [
          {
            DUNSNumber: "804735132",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN MANUFACTURING COMPANY, INC." }
            },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "492 KOLLER ST" }],
              PrimaryTownName: "SAN FRANCISCO",
              CountryISOAlpha2Code: "US",
              PostalCode: "94110",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              CountryISOAlpha2Code: "US",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "6505550000",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Active" },
            FamilyTreeMemberRole: [
              { FamilyTreeMemberRoleText: { $: "Headquarters" } }
            ],
            StandaloneOrganizationIndicator: false,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Name" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZFFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0099999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 1
          },

          {
            DUNSNumber: "038732116",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN MANUFACTURING COMPANY, INC." }
            },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "1073 S BOYLE AVE" }],
              PrimaryTownName: "LOS ANGELES",
              CountryISOAlpha2Code: "US",
              PostalCode: "90023",
              PostalCodeExtensionCode: "1246",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              CountryISOAlpha2Code: "US",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "6505550000",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Active" },
            FamilyTreeMemberRole: [
              { FamilyTreeMemberRoleText: { $: "Branch" } }
            ],
            StandaloneOrganizationIndicator: false,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Name" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZFFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0099999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 2
          },
          {
            DUNSNumber: "362281243",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN MANUFACTURING COMPANY, INC." }
            },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "1073 S BOYLE AVE" }],
              PrimaryTownName: "LOS ANGELES",
              CountryISOAlpha2Code: "US",
              PostalCode: "90023",
              PostalCodeExtensionCode: "1246",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              CountryISOAlpha2Code: "US",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "6505550000",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Active" },
            FamilyTreeMemberRole: [
              { FamilyTreeMemberRoleText: { $: "Branch" } }
            ],
            StandaloneOrganizationIndicator: false,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Name" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZFFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0099999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 3
          },
          {
            DUNSNumber: "009175688",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN MFG CO INC" }
            },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "8129 JUNIPERO ST STE A" }],
              PrimaryTownName: "SACRAMENTO",
              CountryISOAlpha2Code: "US",
              PostalCode: "95828",
              PostalCodeExtensionCode: "1603",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              StreetAddressLine: [{ LineText: "PO BOX 756" }],
              PrimaryTownName: "WOODLAND",
              CountryISOAlpha2Code: "US",
              PostalCode: "95776",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "5306620211",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Out of Business" },
            StandaloneOrganizationIndicator: true,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Name" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZFFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0099999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 4
          },
          {
            DUNSNumber: "199650169",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN, DENNIS" }
            },
            TradeStyleName: { OrganizationName: { $: "GORMAN MANUFACTURING" } },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "12 W KENTUCKY AVE" }],
              PrimaryTownName: "WOODLAND",
              CountryISOAlpha2Code: "US",
              PostalCode: "95695",
              PostalCodeExtensionCode: "5837",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              CountryISOAlpha2Code: "US",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "5306627750",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Out of Business" },
            StandaloneOrganizationIndicator: true,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Trade style" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZBFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "B",
                  MatchGradeComponentScore: 51
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0299999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "02"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 5
          },
          {
            DUNSNumber: "088847942",
            OrganizationPrimaryName: {
              OrganizationName: { $: "GORMAN MFG & SUPPLY CO" }
            },
            PrimaryAddress: {
              StreetAddressLine: [{ LineText: "6516 MATTOS LN" }],
              PrimaryTownName: "SACRAMENTO",
              CountryISOAlpha2Code: "US",
              PostalCode: "95829",
              PostalCodeExtensionCode: "9309",
              TerritoryAbbreviatedName: "CA",
              UndeliverableIndicator: false
            },
            MailingAddress: {
              CountryISOAlpha2Code: "US",
              UndeliverableIndicator: false
            },
            TelephoneNumber: {
              TelecommunicationNumber: "9163810282",
              UnreachableIndicator: false
            },
            OperatingStatusText: { $: "Out of Business" },
            StandaloneOrganizationIndicator: true,
            MatchQualityInformation: {
              ConfidenceCodeValue: 6,
              MatchBasis: [
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Name" }
                },
                {
                  EndIndicator: false,
                  SubjectTypeText: "Business",
                  SeniorPrincipalIndicator: false,
                  MatchBasisText: { $: "Primary Address" }
                }
              ],
              MatchGradeText: "AZZZAZZZFFZ",
              MatchGradeComponentCount: 11,
              MatchGradeComponent: [
                {
                  MatchGradeComponentTypeText: { $: "Name" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 80
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Number" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Street Name" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "City" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "State" },
                  MatchGradeComponentRating: "A",
                  MatchGradeComponentScore: 100
                },
                {
                  MatchGradeComponentTypeText: { $: "PO Box" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Phone" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Postal Code" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Density" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 0
                },
                {
                  MatchGradeComponentTypeText: { $: "Uniqueness" },
                  MatchGradeComponentRating: "F",
                  MatchGradeComponentScore: 20
                },
                {
                  MatchGradeComponentTypeText: { $: "Sic" },
                  MatchGradeComponentRating: "Z",
                  MatchGradeComponentScore: 0
                }
              ],
              MatchDataProfileText: "0099999900999899000000009898",
              MatchDataProfileComponentCount: 14,
              MatchDataProfileComponent: [
                {
                  MatchDataProfileComponentTypeText: { $: "Name" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Number" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Street Name" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "City" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "State" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "PO Box" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Phone" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Postal Code" },
                  MatchDataProfileComponentValue: "99"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "DUNS" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "SIC" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Density" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "Uniqueness" },
                  MatchDataProfileComponentValue: "00"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "National ID" },
                  MatchDataProfileComponentValue: "98"
                },
                {
                  MatchDataProfileComponentTypeText: { $: "URL" },
                  MatchDataProfileComponentValue: "98"
                }
              ]
            },
            DisplaySequence: 6
          }
        ]
      }
    }
  }
};
