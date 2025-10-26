package com.gitride.android.ui.screens

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.gitride.android.ui.screens.auth.LoginScreen
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun loginScreen_displaysCorrectElements() {
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = {}
            )
        }

        // Check if app title is displayed
        composeTestRule.onNodeWithText("GitRide").assertIsDisplayed()
        
        // Check if subtitle is displayed
        composeTestRule.onNodeWithText("Your ride, your way").assertIsDisplayed()
        
        // Check if email field is displayed
        composeTestRule.onNodeWithText("Email").assertIsDisplayed()
        
        // Check if password field is displayed
        composeTestRule.onNodeWithText("Password").assertIsDisplayed()
        
        // Check if sign in button is displayed
        composeTestRule.onNodeWithText("Sign In").assertIsDisplayed()
        
        // Check if sign up link is displayed
        composeTestRule.onNodeWithText("Don't have an account?").assertIsDisplayed()
        composeTestRule.onNodeWithText("Sign Up").assertIsDisplayed()
    }

    @Test
    fun loginScreen_emailFieldIsEditable() {
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = {}
            )
        }

        // Find email field and type text
        composeTestRule.onNodeWithText("Email").performTextInput("test@example.com")
        
        // Verify text was entered
        composeTestRule.onNodeWithText("test@example.com").assertIsDisplayed()
    }

    @Test
    fun loginScreen_passwordFieldIsEditable() {
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = {}
            )
        }

        // Find password field and type text
        composeTestRule.onNodeWithText("Password").performTextInput("password123")
        
        // Verify text was entered (password should be hidden)
        composeTestRule.onNodeWithText("password123").assertExists()
    }

    @Test
    fun loginScreen_signUpButtonIsClickable() {
        var signUpClicked = false
        
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = { signUpClicked = true }
            )
        }

        // Click sign up button
        composeTestRule.onNodeWithText("Sign Up").performClick()
        
        // Verify callback was called
        assertTrue(signUpClicked)
    }

    @Test
    fun loginScreen_signInButtonIsDisabledWhenFieldsEmpty() {
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = {}
            )
        }

        // Check if sign in button is disabled
        composeTestRule.onNodeWithText("Sign In").assertIsNotEnabled()
    }

    @Test
    fun loginScreen_signInButtonIsEnabledWhenFieldsFilled() {
        composeTestRule.setContent {
            LoginScreen(
                onLoginSuccess = {},
                onNavigateToSignUp = {}
            )
        }

        // Fill email field
        composeTestRule.onNodeWithText("Email").performTextInput("test@example.com")
        
        // Fill password field
        composeTestRule.onNodeWithText("Password").performTextInput("password123")
        
        // Check if sign in button is enabled
        composeTestRule.onNodeWithText("Sign In").assertIsEnabled()
    }
}
