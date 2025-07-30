
DIFF_PROMPT = """
Compare these two legislative texts. Output changes in git-diff style:
+ Addition  
- Removal  
~ Modified line  

After each change, add a comment explaining the legal/social/economic impact.

Bill A: {bill_a}
Bill B: {bill_b}
"""

STAKEHOLDER_PROMPT = """
Analyze who benefits and who might be harmed by this legislation.
List specific groups, industries, demographics, and institutions.
Consider both direct and indirect effects.
"""

FORECAST_PROMPT = """
Predict the outcomes if this bill passes:
- Short-term (1 year): [impacts]
- Medium-term (3 years): [impacts]  
- Long-term (5 years): [impacts]
Include economic costs/benefits, social changes, and political ramifications.
""" 