function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function validate(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Data yang dikirim tidak valid.");
  }

  if (!body.card_number?.trim()) {
    throw new Error("Nomor kartu wajib diisi.");
  }

  if (!body.bank?.trim()) {
    throw new Error("Bank wajib diisi.");
  }

  if (!body.name?.trim()) {
    throw new Error("Nama wajib diisi.");
  }

  if (!body.expiry_date) {
    throw new Error("Masa aktif wajib diisi.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.expiry_date)) {
    throw new Error("Format tanggal masa aktif tidak valid.");
  }

  const alertDays = Number(body.alert_days);

  if (!Number.isFinite(alertDays) || alertDays < 0) {
    throw new Error("Jumlah hari alert tidak valid.");
  }
}

export async function onRequestGet(context) {
  try {
    if (!context.env.DB) {
      throw new Error("Binding database DB belum aktif.");
    }

    const result = await context.env.DB.prepare(`
      SELECT
        id,
        card_number,
        bank,
        name,
        expiry_date,
        alert_days,
        created_at,
        updated_at
      FROM cards
      ORDER BY expiry_date ASC
    `).all();

    return json(result.results || []);
  } catch (error) {
    console.error("GET cards error:", error);

    return json(
      {
        error: error?.message || "Gagal membaca database.",
      },
      500
    );
  }
}

export async function onRequestPost(context) {
  try {
    if (!context.env.DB) {
      throw new Error("Binding database DB belum aktif.");
    }

    const body = await context.request.json();

    validate(body);

    const cardNumber = body.card_number.trim();
    const bank = body.bank.trim().toUpperCase();
    const name = body.name.trim().toUpperCase();
    const expiryDate = body.expiry_date;
    const alertDays = Number(body.alert_days);

    const result = await context.env.DB.prepare(`
      INSERT INTO cards (
        card_number,
        bank,
        name,
        expiry_date,
        alert_days
      )
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(
        cardNumber,
        bank,
        name,
        expiryDate,
        alertDays
      )
      .run();

    if (!result.success) {
      throw new Error("Database menolak penyimpanan data.");
    }

    return json(
      {
        success: true,
        id: result.meta?.last_row_id || null,
        message: "Data berhasil disimpan.",
      },
      201
    );
  } catch (error) {
    console.error("POST cards error:", error);

    return json(
      {
        error: error?.message || "Gagal menyimpan data.",
      },
      500
    );
  }
}

export async function onRequestPut(context) {
  try {
    if (!context.env.DB) {
      throw new Error("Binding database DB belum aktif.");
    }

    const id = new URL(context.request.url).searchParams.get("id");

    if (!id) {
      throw new Error("ID data tidak ditemukan.");
    }

    const body = await context.request.json();

    validate(body);

    const result = await context.env.DB.prepare(`
      UPDATE cards
      SET
        card_number = ?,
        bank = ?,
        name = ?,
        expiry_date = ?,
        alert_days = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        body.card_number.trim(),
        body.bank.trim().toUpperCase(),
        body.name.trim().toUpperCase(),
        body.expiry_date,
        Number(body.alert_days),
        Number(id)
      )
      .run();

    if (!result.success) {
      throw new Error("Database gagal memperbarui data.");
    }

    return json({
      success: true,
      message: "Data berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT cards error:", error);

    return json(
      {
        error: error?.message || "Gagal memperbarui data.",
      },
      500
    );
  }
}

export async function onRequestDelete(context) {
  try {
    if (!context.env.DB) {
      throw new Error("Binding database DB belum aktif.");
    }

    const id = new URL(context.request.url).searchParams.get("id");

    if (!id) {
      throw new Error("ID data tidak ditemukan.");
    }

    const result = await context.env.DB.prepare(`
      DELETE FROM cards
      WHERE id = ?
    `)
      .bind(Number(id))
      .run();

    if (!result.success) {
      throw new Error("Database gagal menghapus data.");
    }

    return json({
      success: true,
      message: "Data berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE cards error:", error);

    return json(
      {
        error: error?.message || "Gagal menghapus data.",
      },
      500
    );
  }
}
