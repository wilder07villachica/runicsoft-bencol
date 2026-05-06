package com.runicsoft.gestion.autenticacion.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    /*
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void enviarCorreo(String destino, String asunto, String contenido) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(from);
        mensaje.setTo(destino);
        mensaje.setSubject(asunto);
        mensaje.setText(contenido);

        mailSender.send(mensaje);
    }
    */

    @Value("${mailersend.api.token:${MAILERSEND_API_TOKEN:}}")
    private String mailerSendApiToken;

    @Value("${mail.from:${MAIL_FROM:}}")
    private String fromEmail;

    @Value("${mail.from.name:${MAIL_FROM_NAME:RunicSoft}}")
    private String fromName;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.mailersend.com/v1")
            .build();

    public void enviarCorreo(String destino, String asunto, String contenido) {
        Map<String, Object> body = Map.of(
                "from", Map.of(
                        "email", fromEmail,
                        "name", fromName
                ),
                "to", List.of(
                        Map.of("email", destino)
                ),
                "subject", asunto,
                "text", contenido
        );

        restClient.post()
                .uri("/email")
                .header("Authorization", "Bearer " + mailerSendApiToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}