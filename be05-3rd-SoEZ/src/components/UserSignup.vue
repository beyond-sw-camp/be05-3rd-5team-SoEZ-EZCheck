<template>
    <div>
        <Header />
        <div class="container">
            <form @submit.prevent="register" class="signup-form">

                <h2>회원 가입</h2>

                <div class="form-group row">
                    <label for="userId" class="col-sm-2 col-form-label mt-2">ID</label>
                    <div class="col-sm-7">
                        <input type="text" id="userId" class="form-control" v-model="user.userId"
                            placeholder="ID를 입력하세요">
                    </div>
                    <div class="col-sm-3">
                        <button class="btn btn-primary mt-1" @click="checkId">중복확인</button>
                    </div>
                    <div class="col-sm-12 mt-2">
                        <div class="alert" :class="{ 'alert-success': isIdValid, 'alert-danger': !isIdValid }"
                            v-show="idCheckMessage">{{ idCheckMessage }}
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password" class="col-sm-2 col-form-label mt-2">비밀번호</label>
                    <div class="col-sm-8">
                        <input type="password" id="password" class="form-control" v-model="user.password1"
                            placeholder="비밀번호를 입력하세요">
                    </div>
                </div>

                <div class="form-group row">
                    <label for="confirmPassword" class="col-sm-2 col-form-label">비밀번호 확인</label>
                    <div class="col-sm-8">
                        <input type="password" id="confirmPassword" class="form-control" v-model="passwordConfirm"
                            placeholder="비밀번호 확인">
                    </div>
                    <div class="alert alert-danger col-sm-12 mt-2" v-show="!isPasswordMatch">
                        비밀번호가 일치하지 않습니다.
                    </div>
                </div>

                <div class="form-group row">
                    <label for="username" class="col-sm-2 col-form-label mt-2">이름</label>
                    <div class="col-sm-8">
                        <input type="text" id="username" class="form-control" v-model="user.username"
                            placeholder="이름을 입력하세요">
                    </div>
                </div>

                <div class="form-group row">
                    <label for="phone" class="col-sm-2 col-form-label mt-2">전화번호</label>
                    <div class="col-sm-8">
                        <input type="text" id="phone" class="form-control" v-model="user.phone"
                            placeholder="010-1234-5678">
                    </div>
                </div>

                <div class="form-group row">
                    <label for="email" class="col-sm-2 col-form-label mt-2">이메일</label>
                    <div class="col-sm-7">
                        <input type="email" id="email" class="form-control" v-model="user.email"
                            placeholder="e-mail@example.com">
                    </div>
                    <div class="col-sm-3">
                        <button class="btn btn-primary mt-1" @click="checkEmail">중복확인</button>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-sm-8"></div>
                    <div class="col-sm-4">
                        <button class="btn btn-primary" @click="sendAuthEmail" v-if="isEmailValid"
                            :disabled="isAuthEmailSent">{{ isAuthEmailSent ? '메일 발송 완료' : '인증메일 발송' }}</button>
                    </div>
                </div>

                <div v-if="isAuthEmailSent" class="ml-2">
                    <span>이메일을 확인할 수 없나요?</span>
                    <div class="send-wrapper">
                        <span>스팸 메일함 확인 또는</span>
                        <span class="resend-button" @click="sendAuthEmailAgain" id="authReSend">
                            이곳을 눌러 인증메일 다시 보내기
                        </span>
                    </div>
                </div>
                <div class="col-sm-12 mt-2">
                    <div class="alert" :class="{ 'alert-success': isEmailValid, 'alert-danger': !isEmailValid }"
                        v-show="emailCheckMessage">{{ emailCheckMessage }}
                    </div>
                </div>

                <div class="form-group row" v-if="isAuthEmailSent">
                    <label class="col-sm-2 col-form-label mt-2" for="authCode">인증코드</label>
                    <div class="col-sm-7">
                        <input type="text" id="authCode" class="form-control" v-model="authCode">
                    </div>
                    <div class="col-sm-3">
                        <button class="btn btn-primary mt-1" @click="checkAuthCode">인증확인</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-9"></div>
                    <div class="col-sm-3">
                        <button type="submit" class="btn btn-primary mt-1" :disabled="!isAllValid">가입요청</button>
                    </div>
                </div>
            </form>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <p>{{ modalMessage }}</p>
                <button class="close-button" @click="closeModal">닫기</button>
            </div>
        </div>

        <div v-if="isAuthResultModalVisible" class="modal">
            <div class="modal-content">
                <p>{{ authResultMessage }}</p>
                <button class="close-button" @click="closeAuthResultModal">닫기</button>
            </div>
        </div>
    </div>


</template>

<script>
import { ref, computed } from 'vue';
import axios from '@/axios';
import Header from './Header.vue';
import { useRouter } from 'vue-router';

export default {
    components: { Header },
    name: 'UserSignup',

    setup() {
        const user = ref({
            userId: '',
            password1: '',
            username: '',
            phone: '',
            email: ''
        });
        const router = useRouter();
        const passwordConfirm = ref('')
        const authCode = ref('')
        const isIdValid = ref(false)
        const isEmailValid = ref(false)
        const isAuthCodeValid = ref(false)
        const isAuthEmailSent = ref(false)
        const isAuthResultModalVisible = ref(false)
        const showModal = ref(false)
        const modalMessage = ref('')
        const idCheckMessage = ref('')
        const emailCheckMessage = ref('')
        const authResultMessage = ref('')
        const pattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;

        const isPasswordMatch = computed(() => {
            return user.value.password1 === passwordConfirm.value
        });

        const isAllValid = computed(() => {
            return isIdValid.value && isEmailValid.value && isAuthCodeValid.value && isPasswordMatch.value
        });

        const checkId = async () => {
            try {
                const response = await axios.post('http://localhost:8080/user/check-id', { userId: user.value.userId })
                if (user.value.userId != '' && response.data === false) {
                    isIdValid.value = true
                    idCheckMessage.value = '사용가능한 아이디 입니다.'
                    modalMessage.value = '사용가능한 아이디 입니다.'
                    console.log("modalMessage : ", modalMessage.value);
                    console.log("isIdValid : ", isIdValid.value);
                } else {
                    isIdValid.value = false
                    idCheckMessage.value = '이미 사용중인 아이디 입니다.'
                    modalMessage.value = '이미 사용중인 아이디 입니다.'
                    console.log("modalMessage : ", modalMessage.value);
                    console.log("isIdValid : ", isIdValid.value);
                }
                showModal.value = true
            }
            catch (error) {
                console.error(error)
            }
        };

        const checkEmail = async () => {
            try {
                const response = await axios.post('http://localhost:8080/user/check-email', { email: user.value.email })
                if (pattern.test(user.value.email) && response.data === false) {
                    isEmailValid.value = true
                    emailCheckMessage.value = '사용가능한 이메일 입니다.'
                    modalMessage.value = '사용가능한 이메일 입니다.'
                    console.log("modalMessage : ", modalMessage.value);
                    console.log("isEmailValid : ", isEmailValid.value);
                } else {
                    isEmailValid.value = false
                    emailCheckMessage.value = '사용할 수 없는 이메일 입니다.'
                    modalMessage.value = '사용할 수 없는 이메일 입니다.'
                    console.log("modalMessage : ", modalMessage.value);
                    console.log("isEmailValid : ", isEmailValid.value);
                }
            }
            catch (error) {
                console.error(error)
            }

        };

        const sendAuthEmail = async () => {
            try {
                alert("인증 메일이 발송되었습니다.");
                await axios.post('http://localhost:8080/user/auth/send', { email: user.value.email })
                isAuthEmailSent.value = true
            }
            catch (error) {
                console.error(error)
            }
        };

        const sendAuthEmailAgain = async () => {
            try {
                alert("인증 메일이 다시 발송되었습니다.");
                await axios.post('http://localhost:8080/user/auth/send', { email: user.value.email })
                modalMessage.value = `인증 메일이 ${user.value.email}로 다시 전송되었습니다.`
                showModal.value = true
            }
            catch (error) {
                console.error(error)
            }
        };

        const checkAuthCode = async () => {
            try {
                const response = await axios.post('http://localhost:8080/user/auth/check', { email: user.value.email, authCode: authCode.value })
                isAuthCodeValid.value = response.data
                if (isAuthCodeValid.value === true) {
                    authResultMessage.value = '인증되었습니다.'
                    console.log("authResultMessage : ", authResultMessage.value);
                    alert("인증되었습니다.");
                } else {
                    authResultMessage.value = '인증코드가 일치하지 않습니다.'
                    console.log("authResultMessage : ", authResultMessage.value);
                    alert("인증코드가 일치하지 않습니다.");
                }
                isAuthResultModalVisible.value = true
            }
            catch (error) {
                console.error(error)
            }
        };

        const register = async () => {
            if (!isAllValid.value) return
            try {
                const response = await axios.post('http://localhost:8080/user/register', user.value)
                modalMessage.value = response.data
                window.alert(modalMessage.value)
                router.push('/')
            }
            catch (error) {
                console.error(error)
            }
        };

        const closeModal = () => {
            showModal.value = false
        };

        const closeAuthResultModal = () => {
            isAuthResultModalVisible.value = false
        };

        return {
            user,
            passwordConfirm,
            authCode,
            isIdValid,
            isEmailValid,
            isAuthCodeValid,
            isPasswordMatch,
            isAllValid,
            isAuthEmailSent,
            showModal,
            modalMessage,
            idCheckMessage,
            emailCheckMessage,
            authResultMessage,
            isAuthResultModalVisible,
            checkId,
            checkEmail,
            sendAuthEmail,
            sendAuthEmailAgain,
            checkAuthCode,
            register,
            closeModal,
            closeAuthResultModal,
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.signup-form {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    font-weight: bold;
}

.form-control {
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 5px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 8px;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.alert {
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
}

.alert-success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.alert-danger {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    background: #f3f3f3;
    border-radius: 10px;
    z-index: 1000;
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 30px;
    border-radius: 10px;
    color: #333;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #aaa;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
}

.resend-button {
    cursor: pointer;
    color: #0056b3;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .form-control {
        width: 100%;
        margin-right: 0;
    }
}

button {
    padding: 10px 20px;
    font-size: 18px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block;
    margin: 0 auto;
    /* 가운데 정렬 */
}

button:hover {
    background-color: #0056b3;
}

.send-wrapper {
    font-size: 15px;
}
</style>