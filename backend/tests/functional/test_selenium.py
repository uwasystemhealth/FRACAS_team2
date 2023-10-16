from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from app.models.record import Record

delay = 10 # How many seconds to search for an element
root_url = "localhost:3000"

"""
GIVEN A selenium webdriver 
WHEN The driver initially accesses the root url
THEN The driver is redirected to the login page
"""
def test_login_redirect(driver):
    
    driver.get(root_url)

    try:
        WebDriverWait(driver,delay).until(lambda driver: "login" in driver.current_url)
    except:
        assert(False)

"""
GIVEN A selenium webdriver
WHEN The driver attempts to log in and create a report
THEN Login and report creation are successful and the report fields in the database are correct
"""
def test_login_and_create_record(driver, user_data, record_data):

    # Record Information
    title = "Test record title"
    subsystem = "Test subsystem"
    car_year = 2022
    time_of_failure = "982023931pm"
    description = "The LV PDM buck converter on '22 (Flo) failed whist driving."
    impact = """The pump for cooling the motor lost power, cannot test drive the car until fixed. 
        Delaying vehicle testing and driver training. Lengthy troubleshooting/repair is 
        diverting time from designing and manufacturing the 2023 car."""
    cause = "Overheating of the inductor due to high current."
    mechanism = "Dielectric breakdown"
    corrective_action = """Replace broken inductor with a new lower-resistance inductor 
        and validate reduced operating temperature with bench testing under expected load."""
    

    driver.get(root_url + "/login")

    # Log in
    try:

        email_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.ID, "email")))
        email_field.clear()
        email_field.send_keys("wolff@test.com")

        password_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.ID, "password")))
        password_field.clear()
        password_field.send_keys("test")

        login_btn = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.XPATH,"//*[contains(text(), 'Sign In')]")))
        login_btn.click()

    except: # Element doesn't exist
        assert(False)


    # Create Report
    try:
        create_report_btn = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.XPATH,"//*[contains(text(), 'Create Report')]")))
        create_report_btn.click()

        # Create and select subsystem
        new_subsystem_btn = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.XPATH,"//*[contains(text(), 'Add New Subsystem')]")))
        new_subsystem_btn.click()

        subsystem_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.CSS_SELECTOR,"div[role='dialog'] input")))

        subsystem_field.clear()
        subsystem_field.send_keys(subsystem)

        subsystem_submit_btn = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.CSS_SELECTOR,"div[role='dialog'] button")))

        WebDriverWait(driver,delay).until(EC.element_to_be_clickable(subsystem_submit_btn))
        subsystem_submit_btn.click()

        subsystem_dropdown = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.ID,"mui-component-select-subsystem_name")))
        subsystem_dropdown.click()

        pdm_option = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.XPATH,f"//*[contains(text(), '{subsystem}')]")))
        pdm_option.click()

        # Add title
        title_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"title")))
        title_field.clear()
        title_field.send_keys(title)

        # Select car year
        car_year_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.CSS_SELECTOR,"input[placeholder='YYYY']")))
        car_year_field.clear()
        car_year_field.send_keys(car_year)

        # Select time of failure
        ToF_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.CSS_SELECTOR,"input[placeholder='MM/DD/YYYY hh:mm aa']")))
        car_year_field.click()
        car_year_field.send_keys([Keys.TAB,Keys.TAB])
        ToF_field.send_keys(time_of_failure)

        # Add description
        description_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"description")))
        description_field.clear()
        description_field.send_keys(description)

        # Open analysis and corrective action
        analysis_corrective = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.XPATH,"//*[contains(text(), 'Analysis & Corrective')]")))
        analysis_corrective.click()


        # Add impact
        impact_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"impact")))
        impact_field.clear()
        impact_field.send_keys(impact)


        # Add cause
        cause_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"cause")))
        cause_field.clear()
        cause_field.send_keys(cause)


        # Add mechanism
        mechanism_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"mechanism")))
        mechanism_field.clear()
        mechanism_field.send_keys(mechanism)


        # Add corrective action plan
        corrective_action_field = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.NAME,"corrective_action_plan")))
        corrective_action_field.clear()
        corrective_action_field.send_keys(corrective_action)

        
        # Submit report
        report_submit_btn = WebDriverWait(driver,delay).until(EC.presence_of_element_located((By.CSS_SELECTOR,"button[type='submit']")))
        report_submit_btn.click()


    except Exception as error:
        print("error = ",error)
        assert(False)


    # Check for record in database

    returned_record = Record.query.filter_by(title=title).all()[0]
    

    assert(returned_record.car_year == car_year)
    assert(returned_record.subsystem_name == subsystem)
    assert(returned_record.description == description)
    assert(returned_record.impact == impact)
    assert(returned_record.cause == cause)
    assert(returned_record.mechanism == mechanism)
    assert(returned_record.corrective_action_plan == corrective_action)

