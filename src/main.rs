use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let app = Router::new()
        .route("/", get(index))
        .nest_service("/static", ServeDir::new("static"));
    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    axum::serve(listener, app).await
}

async fn index() -> impl IntoResponse {
    (StatusCode::OK, Html("Hello"))
}
