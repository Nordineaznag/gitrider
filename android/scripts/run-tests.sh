#!/bin/bash

# GitRide Android Test Runner Script
# This script runs different types of tests

echo "🧪 GitRide Android Test Runner"
echo "=============================="

# Check if we're in the android directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Please run this script from the android directory"
    exit 1
fi

# Function to run unit tests
run_unit_tests() {
    echo "🔬 Running Unit Tests..."
    ./gradlew test
    
    if [ $? -eq 0 ]; then
        echo "✅ Unit tests passed!"
    else
        echo "❌ Unit tests failed!"
        return 1
    fi
}

# Function to run UI tests
run_ui_tests() {
    echo "📱 Running UI Tests..."
    
    # Check if device is connected
    DEVICE_COUNT=$(adb devices | grep -c "device$")
    if [ $DEVICE_COUNT -eq 0 ]; then
        echo "⚠️  No devices connected. UI tests require a device or emulator."
        echo "   Please connect a device or start an emulator first."
        return 1
    fi
    
    ./gradlew connectedAndroidTest
    
    if [ $? -eq 0 ]; then
        echo "✅ UI tests passed!"
    else
        echo "❌ UI tests failed!"
        return 1
    fi
}

# Function to run performance tests
run_performance_tests() {
    echo "⚡ Running Performance Tests..."
    
    # Check if device is connected
    DEVICE_COUNT=$(adb devices | grep -c "device$")
    if [ $DEVICE_COUNT -eq 0 ]; then
        echo "⚠️  No devices connected. Performance tests require a device."
        return 1
    fi
    
    # Install app for performance testing
    ./gradlew installDebug
    
    # Run performance tests
    ./gradlew connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.gitride.android.PerformanceTest
    
    if [ $? -eq 0 ]; then
        echo "✅ Performance tests passed!"
    else
        echo "❌ Performance tests failed!"
        return 1
    fi
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running All Tests..."
    
    # Run unit tests
    run_unit_tests
    if [ $? -ne 0 ]; then
        echo "❌ Stopping due to unit test failures"
        exit 1
    fi
    
    # Run UI tests
    run_ui_tests
    if [ $? -ne 0 ]; then
        echo "❌ Stopping due to UI test failures"
        exit 1
    fi
    
    # Run performance tests
    run_performance_tests
    if [ $? -ne 0 ]; then
        echo "❌ Stopping due to performance test failures"
        exit 1
    fi
    
    echo "🎉 All tests passed!"
}

# Function to show test coverage
show_coverage() {
    echo "📊 Generating Test Coverage Report..."
    ./gradlew testDebugUnitTestCoverage
    
    if [ $? -eq 0 ]; then
        echo "✅ Coverage report generated!"
        echo "📁 Report location: app/build/reports/jacoco/testDebugUnitTestCoverage/html/index.html"
        echo "🌐 Open in browser: file://$(pwd)/app/build/reports/jacoco/testDebugUnitTestCoverage/html/index.html"
    else
        echo "❌ Coverage report generation failed!"
    fi
}

# Function to run specific test class
run_specific_test() {
    local test_class=$1
    if [ -z "$test_class" ]; then
        echo "❌ Please specify a test class name"
        echo "   Usage: $0 specific <TestClassName>"
        return 1
    fi
    
    echo "🎯 Running specific test: $test_class"
    ./gradlew test --tests "$test_class"
    
    if [ $? -eq 0 ]; then
        echo "✅ Test $test_class passed!"
    else
        echo "❌ Test $test_class failed!"
    fi
}

# Function to run tests with debugging
run_tests_with_debug() {
    echo "🐛 Running tests with debug information..."
    
    # Enable debug logging
    export ANDROID_ENABLE_DEBUG_LOGGING=true
    
    # Run tests with verbose output
    ./gradlew test --info --stacktrace
    
    if [ $? -eq 0 ]; then
        echo "✅ Debug tests completed!"
    else
        echo "❌ Debug tests failed!"
    fi
}

# Function to show help
show_help() {
    echo "GitRide Android Test Runner"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  unit          Run unit tests only"
    echo "  ui            Run UI tests only (requires device/emulator)"
    echo "  performance   Run performance tests (requires device)"
    echo "  all           Run all tests"
    echo "  coverage      Generate test coverage report"
    echo "  specific      Run specific test class"
    echo "  debug         Run tests with debug information"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 unit                    # Run unit tests"
    echo "  $0 ui                      # Run UI tests"
    echo "  $0 all                     # Run all tests"
    echo "  $0 specific UserTest       # Run UserTest class"
    echo "  $0 coverage                # Generate coverage report"
}

# Main script logic
case "$1" in
    "unit")
        run_unit_tests
        ;;
    "ui")
        run_ui_tests
        ;;
    "performance")
        run_performance_tests
        ;;
    "all")
        run_all_tests
        ;;
    "coverage")
        show_coverage
        ;;
    "specific")
        run_specific_test "$2"
        ;;
    "debug")
        run_tests_with_debug
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        echo "❌ Please specify a command"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
