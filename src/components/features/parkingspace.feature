Feature: Parking Space Component

    Scenario: Add a new parking space
        Given that there is a Parking Space Component
        When I click on the "Add Space" button
        Then a new parking space should be added to the list of available spaces

    Scenario: Remove an existing parking space
        Given that there is a Parking Space Component
        And there is more than one parking space available
        When I click on the "Remove Space" button
        Then a parking space should be removed from the list of available spaces

    Scenario: Register a parking lot
        Given that there is a Parking Space Component
        And I have selected a parking space
        When I click on the "Register Lot" button
        Then a form should appear to register the parking lot
        And I should be able to enter the registration and parking time
        And when I submit the form, the lot should be registered

    Scenario: Make payment for an occupied parking lot
        Given that there is a Parking Space Component
        And there is an occupied parking space
        When I click on the "Make Payment" button
        Then I should be redirected to the payment page