                    CloudForge VPC
                    10.0.0.0/16
                         │
        ┌────────────────┴────────────────┐
        │                                 │
     us-east-1a                        us-east-1b
        │                                 │
  ┌─────┴─────┐                     ┌─────┴─────┐
  │           │                     │           │
Public      Private                Public      Private
10.0.1/24   10.0.11/24             10.0.2/24   10.0.12/24

                    + us-east-1c
                         │
                    Public + Private
                   
                  10.0.3/24  10.0.13/24
                              