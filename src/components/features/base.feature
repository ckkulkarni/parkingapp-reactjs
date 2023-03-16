Feature: Base Component

    Scenario: User enters the number of spaces
        Given the user is on the home page
        When the user enters some input in the input field and submits
        Then an alert is displayed with "10 Spaces selected"
        And the parking lot should be initialized with 10 spaces
        When the user clicks the "Start App" button, the user should be taken to the spaces page
