package testmode

import "os"

const ENV_VAR = "TEST_MODE"

func IsTestMode() bool {
	return os.Getenv(ENV_VAR) == "true"
}
