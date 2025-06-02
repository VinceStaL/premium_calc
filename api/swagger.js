const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Premium Calculator API',
      version: '1.0.0',
      description: 'API for calculating health insurance premiums',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        PremiumParams: {
          type: 'object',
          required: [
            'effectiveDate',
            'productCodes',
            'stateCode',
            'scaleCode',
            'rateCode',
            'paymentFrequency'
          ],
          properties: {
            effectiveDate: {
              type: 'string',
              format: 'date',
              example: '2025-06-01',
              description: 'Effective date for the premium calculation'
            },
            productCodes: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['H0A', 'HA0'],
              description: 'Array of product codes to calculate premiums for'
            },
            stateCode: {
              type: 'string',
              example: 'A',
              description: 'State code (A, N, Q, S, T, V, W, X)'
            },
            scaleCode: {
              type: 'string',
              example: 'S',
              description: 'Scale code (S: Single, D: Couple, F: Family, P: Single Parent, Q: Extended Family, E: Extended)'
            },
            rateCode: {
              type: 'string',
              example: '0',
              description: 'Rate code'
            },
            paymentFrequency: {
              type: 'string',
              enum: ['weekly', 'fortnightly', 'monthly', 'quarterly', 'halfYearly', 'yearly'],
              example: 'monthly',
              description: 'Payment frequency'
            },
            rebateType: {
              type: 'string',
              example: 'RB',
              description: 'Rebate type code'
            },
            lhcPercentage: {
              type: 'number',
              example: 0,
              description: 'LHC percentage'
            },
            useBaseRate: {
              type: 'boolean',
              example: true,
              description: 'Whether to use base rate for calculation'
            },
            useRiskRating: {
              type: 'boolean',
              example: false,
              description: 'Whether to apply risk rating'
            },
            sex1: {
              type: 'string',
              enum: ['M', 'F'],
              example: 'M',
              description: 'Sex of person 1 (required if useRiskRating is true)'
            },
            age1: {
              type: 'number',
              example: 30,
              description: 'Age of person 1 (required if useRiskRating is true)'
            },
            sex2: {
              type: 'string',
              enum: ['M', 'F'],
              example: 'F',
              description: 'Sex of person 2 (required for couple/family if useRiskRating is true)'
            },
            age2: {
              type: 'number',
              example: 28,
              description: 'Age of person 2 (required for couple/family if useRiskRating is true)'
            }
          }
        },
        PremiumResult: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productCode: {
                    type: 'string',
                    example: 'H0A'
                  },
                  basePremium: {
                    type: 'number',
                    example: 286.8
                  },
                  scaledBasePremium: {
                    type: 'number',
                    example: 286.8
                  },
                  scaleAndFrequencyPremium: {
                    type: 'number',
                    example: 286.8
                  },
                  finalPremium: {
                    type: 'number',
                    example: 286.8
                  },
                  scaleFactor: {
                    type: 'number',
                    nullable: true,
                    example: 1
                  },
                  riskLoading1: {
                    type: 'number',
                    nullable: true,
                    example: null
                  },
                  riskLoading2: {
                    type: 'number',
                    nullable: true,
                    example: null
                  },
                  riskLoadingAmount1: {
                    type: 'number',
                    nullable: true,
                    example: null
                  },
                  riskLoadingAmount2: {
                    type: 'number',
                    nullable: true,
                    example: null
                  },
                  rebatePercentage: {
                    type: 'number',
                    nullable: true,
                    example: null
                  },
                  rebateAmount: {
                    type: 'number',
                    example: 0
                  },
                  premiumBeforeRebate: {
                    type: 'number',
                    example: 286.8
                  },
                  lhcPercentage: {
                    type: 'number',
                    example: 0
                  },
                  lhcAmount: {
                    type: 'number',
                    example: 0
                  }
                }
              }
            },
            totalPremium: {
              type: 'number',
              example: 286.8
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'At least one Product Code is required'
            }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;